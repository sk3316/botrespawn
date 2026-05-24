type Props = {
  gameName: string
}

export default function AffiliateLinks({ gameName }: Props) {
  const encoded = encodeURIComponent(gameName)

  const links = [
    {
      name: 'Steam',
      url: `https://store.steampowered.com/search/?term=${encoded}`,
      bg: 'hover:bg-blue-900',
      border: 'hover:border-blue-500',
      text: 'hover:text-blue-400',
      icon: '🎮',
    },
    {
      name: 'Amazon',
      url: `https://www.amazon.in/s?k=${encoded}+game&tag=botrespawn-21`,
      bg: 'hover:bg-yellow-900',
      border: 'hover:border-yellow-500',
      text: 'hover:text-yellow-400',
      icon: '📦',
    },
    {
      name: 'Humble Bundle',
      url: `https://www.humblebundle.com/store/search?search=${encoded}`,
      bg: 'hover:bg-red-900',
      border: 'hover:border-red-500',
      text: 'hover:text-red-400',
      icon: '🎁',
    },
    {
      name: 'Epic Games',
      url: `https://store.epicgames.com/en-US/browse?q=${encoded}`,
      bg: 'hover:bg-gray-700',
      border: 'hover:border-gray-400',
      text: 'hover:text-white',
      icon: '⚡',
    },
  ]

  return (
    <div className="mt-8 bg-gray-900 border border-gray-800 rounded-xl p-6">
      <div className="text-xs text-gray-500 font-bold tracking-widest mb-1">WHERE TO BUY</div>
      <div className="text-white font-black text-lg mb-4">🎮 {gameName}</div>
      <div className="grid grid-cols-2 gap-3">
        {links.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-2 bg-gray-800 border border-gray-700 ${link.border} ${link.bg} ${link.text} text-gray-400 px-4 py-3 rounded-lg text-sm font-bold transition`}
          >
            <span>{link.icon}</span>
            {link.name}
            <span className="ml-auto text-xs opacity-50">↗</span>
          </a>
        ))}
      </div>
      <p className="text-gray-600 text-xs mt-4">
        * Affiliate links — BotReSpawn may earn a small commission at no extra cost to you.
      </p>
    </div>
  )
}