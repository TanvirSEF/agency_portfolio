<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9">
  <xsl:output method="html" doctype-system="about:legacy-compat" encoding="UTF-8" indent="yes"/>

  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <link rel="icon" type="image/svg+xml" href="/assets/icons/favicon.svg"/>
        <link rel="shortcut icon" href="/assets/icons/favicon.svg"/>
        <title>XML Sitemap | Webbly Media</title>
        <style>
          * { box-sizing: border-box; }
          :root {
            --bg: #f4f5fb;
            --surface: #ffffff;
            --surface-alt: #f8f7ff;
            --line: #e7e4f4;
            --ink: #1e1f21;
            --ink-soft: #667085;
            --brand: #7936ff;
            --brand-deep: #4a1eb0;
            --brand-soft: #8c52ff;
            --shadow: 0 16px 44px rgba(15, 23, 42, 0.08);
          }
          body {
            margin: 0;
            min-height: 100vh;
            background:
              radial-gradient(540px 260px at 10% -5%, rgba(140, 82, 255, 0.22), transparent 70%),
              radial-gradient(480px 220px at 94% -2%, rgba(121, 54, 255, 0.16), transparent 68%),
              var(--bg);
            color: var(--ink);
            font-family: Poppins, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
            line-height: 1.55;
            padding: 1.3rem 1rem 2.6rem;
          }
          .wrap {
            width: min(1120px, 100%);
            margin: 0 auto;
          }
          .head {
            background: var(--surface);
            border: 1px solid var(--line);
            border-radius: 20px;
            box-shadow: var(--shadow);
            overflow: hidden;
          }
          .head-top {
            height: 8px;
            background: linear-gradient(90deg, var(--brand-deep), var(--brand), var(--brand-soft));
          }
          .head-body {
            padding: 1.2rem 1.3rem 1.1rem;
          }
          .kicker {
            margin: 0;
            font-size: 0.72rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: var(--brand);
          }
          h1 {
            margin: 0.28rem 0 0;
            font-size: clamp(1.35rem, 2.8vw, 1.95rem);
            line-height: 1.2;
            letter-spacing: -0.015em;
          }
          .sub {
            margin: 0.58rem 0 0;
            color: var(--ink-soft);
            font-size: 0.95rem;
          }
          .sub strong {
            color: var(--ink);
            font-weight: 700;
          }
          .panel {
            margin-top: 1rem;
            background: var(--surface);
            border: 1px solid var(--line);
            border-radius: 16px;
            box-shadow: var(--shadow);
            overflow: hidden;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          thead th {
            background: linear-gradient(90deg, var(--brand-deep), var(--brand), var(--brand-soft));
            color: #ffffff;
            text-align: left;
            font-size: 0.77rem;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            font-weight: 700;
            padding: 0.82rem 0.95rem;
            white-space: nowrap;
          }
          tbody td {
            padding: 0.78rem 0.95rem;
            border-bottom: 1px solid var(--line);
            vertical-align: top;
            font-size: 0.92rem;
            color: var(--ink);
          }
          tbody tr:nth-child(even) td {
            background: var(--surface-alt);
          }
          tbody tr:last-child td {
            border-bottom: none;
          }
          .time {
            color: var(--ink-soft);
            font-variant-numeric: tabular-nums;
            white-space: nowrap;
          }
          a {
            color: #5526cf;
            text-decoration: none;
            word-break: break-word;
          }
          a:hover {
            color: var(--brand);
            text-decoration: underline;
          }
          .tag {
            display: inline-block;
            border: 1px solid #ddd2ff;
            background: #f3edff;
            color: #5d2dd7;
            border-radius: 999px;
            padding: 0.1rem 0.56rem;
            font-size: 0.74rem;
            font-weight: 600;
          }
          .crumbs {
            margin-top: 0.85rem;
            display: flex;
            align-items: center;
            gap: 0.48rem;
            font-size: 0.86rem;
            color: var(--ink-soft);
          }
          .crumbs a {
            color: #4b1fc4;
            font-weight: 600;
          }
          .crumbs .sep {
            color: #98a2b3;
          }
          .crumbs .current {
            color: var(--ink-soft);
            font-weight: 600;
          }
          @media (max-width: 760px) {
            body { padding: 0.8rem 0.55rem 1.8rem; }
            .head { border-radius: 14px; }
            .head-body { padding: 0.95rem 0.9rem; }
            .panel { border-radius: 12px; }
            thead th, tbody td { padding: 0.62rem 0.62rem; }
          }
        </style>
      </head>
      <body>
        <main class="wrap">
          <section class="head">
            <div class="head-top"/>
            <div class="head-body">
              <p class="kicker">Webbly Media</p>
              <h1>XML Sitemap</h1>
              <xsl:choose>
                <xsl:when test="s:sitemapindex">
                  <p class="sub">
                    This sitemap index contains
                    <strong>
                      <xsl:text> </xsl:text>
                      <xsl:value-of select="count(s:sitemapindex/s:sitemap)"/>
                      <xsl:text> </xsl:text>
                    </strong>
                    sitemap files.
                  </p>
                </xsl:when>
                <xsl:otherwise>
                  <p class="sub">
                    This sitemap contains
                    <strong>
                      <xsl:text> </xsl:text>
                      <xsl:value-of select="count(s:urlset/s:url)"/>
                      <xsl:text> </xsl:text>
                    </strong>
                    URLs.
                  </p>
                </xsl:otherwise>
              </xsl:choose>
            </div>
          </section>

          <section class="panel">
            <xsl:choose>
              <xsl:when test="s:sitemapindex">
                <table>
                  <thead>
                    <tr>
                      <th>Sitemap File</th>
                      <th>Last Modified</th>
                      <th>Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    <xsl:for-each select="s:sitemapindex/s:sitemap">
                      <tr>
                        <td>
                          <a href="{s:loc}">
                            <xsl:value-of select="s:loc"/>
                          </a>
                        </td>
                        <td class="time">
                          <xsl:choose>
                            <xsl:when test="normalize-space(s:lastmod) != ''">
                              <xsl:value-of select="s:lastmod"/>
                            </xsl:when>
                            <xsl:otherwise>N/A</xsl:otherwise>
                          </xsl:choose>
                        </td>
                        <td>
                          <xsl:choose>
                            <xsl:when test="contains(s:loc, 'sitemap-blogs.xml')">
                              <span class="tag">Blogs</span>
                            </xsl:when>
                            <xsl:when test="contains(s:loc, 'sitemap-pages.xml')">
                              <span class="tag">Pages</span>
                            </xsl:when>
                            <xsl:otherwise>
                              <span class="tag">Sitemap</span>
                            </xsl:otherwise>
                          </xsl:choose>
                        </td>
                      </tr>
                    </xsl:for-each>
                  </tbody>
                </table>
              </xsl:when>
              <xsl:otherwise>
                <table>
                  <thead>
                    <tr>
                      <th>URL</th>
                      <th>Last Modified</th>
                    </tr>
                  </thead>
                  <tbody>
                    <xsl:for-each select="s:urlset/s:url">
                      <tr>
                        <td>
                          <a href="{s:loc}">
                            <xsl:value-of select="s:loc"/>
                          </a>
                        </td>
                        <td class="time">
                          <xsl:choose>
                            <xsl:when test="normalize-space(s:lastmod) != ''">
                              <xsl:value-of select="s:lastmod"/>
                            </xsl:when>
                            <xsl:otherwise>N/A</xsl:otherwise>
                          </xsl:choose>
                        </td>
                      </tr>
                    </xsl:for-each>
                  </tbody>
                </table>
              </xsl:otherwise>
            </xsl:choose>
          </section>

          <nav class="crumbs" aria-label="Breadcrumb">
            <a href="/">Home</a>
            <span class="sep">/</span>
            <xsl:choose>
              <xsl:when test="s:sitemapindex">
                <span class="current">Sitemap</span>
              </xsl:when>
              <xsl:otherwise>
                <a href="sitemap.xml">Sitemap</a>
                <span class="sep">/</span>
                <span class="current">
                  <xsl:choose>
                    <xsl:when test="contains(string(s:urlset/s:url[1]/s:loc), '/blogs/') or contains(string(s:urlset/s:url[1]/s:loc), '/blogg/')">Blogs</xsl:when>
                    <xsl:otherwise>Pages</xsl:otherwise>
                  </xsl:choose>
                </span>
              </xsl:otherwise>
            </xsl:choose>
          </nav>
        </main>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
