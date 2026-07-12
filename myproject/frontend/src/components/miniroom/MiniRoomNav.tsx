'use client'

type Tab = '홈' | '글' | '방명록' | '타임캡슐' | '랜덤연결' | '친구'

type MiniRoomNavProps = {
  activeTab: Tab
  isOwner: boolean
  onTabChange: (tab: Tab) => void
}

const BASE_TABS: Tab[] = ['홈', '글', '방명록', '타임캡슐']
const OWNER_TABS: Tab[] = ['랜덤연결', '친구']

export default function MiniRoomNav({ activeTab, isOwner, onTabChange }: MiniRoomNavProps) {
  const tabs = isOwner ? [...BASE_TABS, ...OWNER_TABS] : BASE_TABS

  return (
    <div className="flex gap-2 border-b mb-4">
      {tabs.map(tab => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === tab ? 'border-b-2 border-black' : 'text-gray-500'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}
