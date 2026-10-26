type QuotePayload = {
  name?: unknown;
  contact?: unknown;
  area?: unknown;
  project?: unknown;
  sourceUrl?: unknown;
  website?: unknown;
};

type ValidQuote = {
  name: string;
  contact: string;
  area: string;
  project: string;
  sourceUrl: string;
};

const allowedAreas = new Set(["Newmarket", "Aurora", "Richmond Hill", "North York", "Vaughan"]);

function clean(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function isValidContact(value: string) {
  const looksLikeEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const looksLikePhone = /^[+\d][\d\s().-]+$/.test(value) && value.replace(/\D/g, "").length >= 7;
  return looksLikeEmail || looksLikePhone;
}

function validate(payload: QuotePayload) {
  const quote = {
    name: clean(payload.name, 80),
    contact: clean(payload.contact, 120),
    area: clean(payload.area, 80),
    project: clean(payload.project, 2000),
    sourceUrl: clean(payload.sourceUrl, 500),
  };

  if (quote.name.length < 2) return { error: "Please enter your name." } as const;
  if (!isValidContact(quote.contact)) return { error: "Please enter a valid phone number or email." } as const;
  if (!allowedAreas.has(quote.area)) return { error: "Please choose a valid project location." } as const;
  if (quote.project.length < 10) return { error: "Please add a little more detail about the project." } as const;

  return { quote } as const;
}

async function ensureQuoteTable(db: D1Database) {
  await db.prepare(`CREATE TABLE IF NOT EXISTS quote_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    contact TEXT NOT NULL,
    area TEXT NOT NULL,
    project TEXT NOT NULL,
    source_url TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'new',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`).run();
}

async function saveLocalQuote(quote: ValidQuote) {
  const [{ appendFile, mkdir }, { join }] = await Promise.all([
    import("node:fs/promises"),
    import("node:path"),
  ]);
  const directory = join(process.cwd(), ".local-data");
  const record = {
    id: crypto.randomUUID(),
    ...quote,
    status: "new",
    createdAt: new Date().toISOString(),
  };

  await mkdir(directory, { recursive: true });
  await appendFile(join(directory, "quote-requests.jsonl"), `${JSON.stringify(record)}\n`, "utf8");
  return record.id;
}

export async function handleQuoteRequest(request: Request, db?: D1Database) {
  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed." }, { status: 405, headers: { allow: "POST" } });
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 16_384) {
    return Response.json({ error: "The request is too large." }, { status: 413 });
  }

  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) {
    return Response.json({ error: "This request must come from the website." }, { status: 403 });
  }

  let payload: QuotePayload;
  try {
    payload = (await request.json()) as QuotePayload;
  } catch {
    return Response.json({ error: "The form data could not be read." }, { status: 400 });
  }

  // Bots commonly fill fields hidden from real visitors. Return success without storing it.
  if (clean(payload.website, 200)) {
    return Response.json({ ok: true }, { status: 201 });
  }

  const result = validate(payload);
  if ("error" in result) {
    return Response.json({ error: result.error }, { status: 400 });
  }

  try {
    if (!db) {
      const id = await saveLocalQuote(result.quote);
      return Response.json({ ok: true, id, storage: "local" }, { status: 201 });
    }

    await ensureQuoteTable(db);
    const saved = await db
        .prepare(`INSERT INTO quote_requests (name, contact, area, project, source_url)
          VALUES (?, ?, ?, ?, ?)`)
        .bind(
          result.quote.name,
          result.quote.contact,
          result.quote.area,
          result.quote.project,
          result.quote.sourceUrl,
        )
        .run();

      return Response.json({ ok: true, id: saved.meta.last_row_id, storage: "d1" }, { status: 201 });
  } catch (error) {
    console.error("Unable to save quote request", error);
    return Response.json(
      { error: "We could not save the request. Please try again or call us." },
      { status: 500 },
    );
  }
}
