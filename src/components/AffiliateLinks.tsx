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
    <div className="glass-card p-6 mb-8 hover:translate-y-0 animate-fade-in-up stagger-2">
      <div className="text-[10px] text-gray-500 font-bold tracking-widest mb-1 uppercase">WHERE TO BUY</div>
      <div className="text-white font-black text-lg mb-4">🎮 {gameName}</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {links.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-2 bg-gray-950/60 border border-gray-850 ${link.border} ${link.bg} ${link.text} text-gray-400 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 hover:translate-x-1`}
          >
            <span className="text-base">{link.icon}</span>
            <span>{link.name}</span>
            <span className="ml-auto text-xs opacity-40 group-hover:opacity-15">↗</span>
          </a>
        ))}
      </div>
      <p className="text-gray-500 text-[10px] mt-4 italic">
        * Affiliate links — BotReSpawn may earn a small commission at no extra cost to you.
      </p>
    </div>
  )
}