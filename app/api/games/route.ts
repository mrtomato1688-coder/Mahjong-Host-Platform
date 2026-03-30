import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const body = await request.json()

    // For prototype: mock authentication
    // TODO: Replace with real authentication
    const mockHostId = '00000000-0000-0000-0000-000000000001'

    const {
      date,
      startTime,
      endTime,
      location,
      maxSeats,
      notes,
      menuItems = [],
    } = body

    // Validate required fields
    if (!date || !startTime || !endTime || !location) {
      return NextResponse.json(
        { error: '請填寫所有必填欄位' },
        { status: 400 }
      )
    }

    // Validate time
    if (startTime >= endTime) {
      return NextResponse.json(
        { error: '結束時間必須晚於開始時間' },
        { status: 400 }
      )
    }

    // Generate unique share code
    const shareCode = generateShareCode()

    // Insert game
    const { data: game, error: gameError } = await supabase
      .from('games')
      .insert({
        host_id: mockHostId,
        share_code: shareCode,
        date,
        start_time: startTime,
        end_time: endTime,
        location,
        max_seats: maxSeats || 4,
        notes: notes || null,
        status: 'active',
      })
      .select()
      .single()

    if (gameError) {
      console.error('Error creating game:', gameError)
      return NextResponse.json(
        { error: '建立遊戲失敗，請稍後再試' },
        { status: 500 }
      )
    }

    // Insert menu items if F&B is enabled
    if (menuItems.length > 0) {
      const menuItemsData = menuItems.map((item: { name: string; emoji: string }) => ({
        game_id: game.id,
        item_name: item.name,
        item_emoji: item.emoji,
      }))

      const { error: menuError } = await supabase
        .from('game_menu_items')
        .insert(menuItemsData)

      if (menuError) {
        console.error('Error creating menu items:', menuError)
        // Don't fail the whole request, just log the error
      }
    }

    return NextResponse.json({
      success: true,
      game: {
        id: game.id,
        shareCode: game.share_code,
      },
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: '系統錯誤，請稍後再試' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()

    // For prototype: mock authentication
    // TODO: Replace with real authentication
    const mockHostId = '00000000-0000-0000-0000-000000000001'

    // Get all games for this host
    const { data: games, error } = await supabase
      .from('games')
      .select(`
        *,
        game_menu_items (*),
        rsvps (*)
      `)
      .eq('host_id', mockHostId)
      .order('date', { ascending: true })

    if (error) {
      console.error('Error fetching games:', error)
      return NextResponse.json(
        { error: '獲取遊戲列表失敗' },
        { status: 500 }
      )
    }

    // Transform data for frontend
    const transformedGames = games.map((game: any) => ({
      id: game.id,
      shareCode: game.share_code,
      date: game.date,
      startTime: game.start_time,
      endTime: game.end_time,
      location: game.location,
      maxSeats: game.max_seats,
      notes: game.notes,
      status: game.status,
      rsvpCount: game.rsvps?.filter((r: any) => r.status === 'confirmed').length || 0,
      menuItems: game.game_menu_items || [],
      createdAt: game.created_at,
    }))

    return NextResponse.json({
      success: true,
      games: transformedGames,
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: '系統錯誤' },
      { status: 500 }
    )
  }
}

// Helper function to generate share code
function generateShareCode(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let code = ''
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}
