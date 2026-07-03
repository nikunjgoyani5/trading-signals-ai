/** Topic-specific scene hints — keeps photo style rules, varies composition per article. */
function deriveCoverSceneDirection(topic: string): string {
  const t = topic.toLowerCase()

  if (/bitcoin|crypto|blockchain|\bbtc\b|ethereum/.test(t)) {
    return `Show cryptocurrency context — phone or laptop with a simple chart, a casual cafe or living room, or hands reviewing a mobile app. Do not use a wall of trading monitors.`
  }

  if (/oil|gold|commodit|silver|crude|\bmetal/.test(t)) {
    return `Hint at commodities or macro markets — notebook notes, a single tablet with a chart, or someone reviewing printed research. Avoid the standard three-monitor trader desk.`
  }

  if (/institutional|hedge fund|prop desk|professional trader/.test(t)) {
    return `Understated institutional finance mood — conference room, analyst with a printed report, or a quiet corporate office. Use a different person and setting than a retail home trader.`
  }

  if (/candlestick|chart pattern|technical analysis|indicator/.test(t)) {
    return `Educational angle — annotated chart on a tablet, notebook with hand-drawn candles, or someone explaining a chart. Prefer teaching over a generic desk portrait.`
  }

  if (/beginner|common people|retail|start trading|learn to trade|earn through/.test(t)) {
    return `Relatable everyday person — kitchen table, small apartment desk, or couch with one laptop. Warm, approachable, non-expert vibe. No expensive multi-monitor setup.`
  }

  if (/volume analysis|order flow|market structure|liquidity/.test(t)) {
    return `Analytical study mood — printed charts, whiteboard sketch, or one screen with volume bars. Thoughtful research scene, not an action-trading glamour shot.`
  }

  if (/psychology|discipline|risk management|emotion/.test(t)) {
    return `Human reflective moment — person pausing with coffee, journal open, calm focus. Minimal screens; emphasize mindset over hardware.`
  }

  if (/s&p|sp500|index|stock market|equit/.test(t)) {
    return `Broad market investing — newspaper, brokerage app on a phone, or a modest workspace with one index chart. Vary age, gender, and room from other covers.`
  }

  return `Choose a scene, props, and composition that clearly match this article. Vary subject, age, gender, room, and camera angle — do not default to the same person at a multi-monitor trading desk.`
}

export function buildCoverImagePrompt(topic: string): string {
  const trimmed = topic.trim()
  return `A natural, candid photograph for a blog cover about: ${trimmed}.

Scene direction for this article only (make it visually distinct from other covers):
${deriveCoverSceneDirection(trimmed)}

The image should look like a real, everyday photo taken by a human:
slightly imperfect composition
natural lighting (not cinematic or dramatic)
realistic environment that fits the topic
minor clutter, irregular details, lived-in feel

Include when relevant to the topic:
people, workspaces, or everyday objects that support the subject — vary props and layout between articles

Camera style:
shot on a phone or DSLR (35mm or 50mm)
slight grain, natural shadows, no dramatic effects

Avoid completely:
anything futuristic or sci-fi
perfect symmetry or overly clean setups
glowing lights, neon effects
ultra sharp HDR, over-processed look
CGI, 3D render, digital art, concept art
“AI aesthetic” (too polished, too perfect)
the same generic trading-desk stock photo (person centered, facing multiple glowing monitors) unless the topic explicitly requires it
reusing the same model, pose, and room layout as other blog covers

Style reference:
looks like a casual Unsplash or candid LinkedIn photo

Output:
realistic, slightly imperfect, human feel
16:9 aspect ratio`
}
