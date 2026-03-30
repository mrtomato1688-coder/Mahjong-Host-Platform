import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ shareCode: string }> }
) {
  try {
    const supabase = createServerClient()
    const { shareCode } = await params

    // Fetch game with related data
    const { data: game, error } = await supabase
      .from('games')
      .select(`
        *,
        hosts (name),
        game_menu_items (*),
        rsvps (*)
      `)
      .eq('share_code', shareCode)
      .eq('status', 'active')
      .single()

    if (error || !game) {
      console.error('Error fetching game:', error)
      return NextResponse.json(
        { error: '找不到此遊戲，或連結已失效' },
        { status: 404 }
      )
    }

    // Transform data for frontend
    const transformedGame = {
      id: game.id,
      shareCode: game.share_code,
      hostName: game.hosts?.name || '主辦人',
      date: game.date,
      startTime: game.start_time,
      endTime: game.end_time,
      location: game.location,
      maxSeats: game.max_seats,
      notes: game.notes,
      status: game.status,
      menuItems: game.game_menu_items?.map((item: any) => ({
        id: item.id,
        name: item.item_name,
        emoji: item.item_emoji,
      })) || [],
      rsvps: game.rsvps?.map((rsvp: any) => ({
        id: rsvp.id,
        playerName: rsvp.player_name,
        playerPhone: rsvp.player_phone,
        status: rsvp.status,
        foodPreferences: rsvp.food_preferences || [],
        createdAt: rsvp.created_at,
      })) || [],
    }

    return NextResponse.json({
      success: true,
      game: transformedGame,
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: '系統錯誤' },
      { status: 500 }
    )
  }
}
