export const dynamic = 'force-static'
export const revalidate = false

export async function GET() {
  return Response.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'neurodiversity-navigator'
  })
}
