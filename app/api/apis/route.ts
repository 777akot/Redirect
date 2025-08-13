import { type NextRequest, NextResponse } from "next/server"
import { createClient, ensureTablesExist } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    // Ensure tables exist before proceeding
    await ensureTablesExist()

    const supabase = createClient()
    const body = await request.json()

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Create API
    const { data: api, error: apiError } = await supabase
      .from("apis")
      .insert({
        ...body.formData,
        price_per_request: Number.parseFloat(body.formData.price_per_request),
        rate_limit: Number.parseInt(body.formData.rate_limit),
        owner_id: user.id,
      })
      .select()
      .single()

    if (apiError) {
      console.error("API creation error:", apiError)
      return NextResponse.json({ error: apiError.message }, { status: 400 })
    }

    // Create endpoints if provided
    if (body.endpoints && body.endpoints.length > 0) {
      const validEndpoints = body.endpoints
        .filter((ep: any) => ep.path && ep.method)
        .map((ep: any) => ({
          ...ep,
          api_id: api.id,
        }))

      if (validEndpoints.length > 0) {
        const { error: endpointsError } = await supabase.from("api_endpoints").insert(validEndpoints)

        if (endpointsError) {
          console.error("Endpoints creation error:", endpointsError)
          // Don't fail the whole request if endpoints fail
        }
      }
    }

    return NextResponse.json({ success: true, api })
  } catch (error) {
    console.error("Error creating API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
