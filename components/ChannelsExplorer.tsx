"use client";

import { useMemo, useState } from 'react';
import { M3UEntry } from '@/lib/m3uParser';

type Category = 'canais' | 'filmes' | 'series';

const categoryLabel: Record<Category, string> = {
  canais: 'Canais TV',
  filmes: 'Filmes',
  series: 'Séries',
};

const categoryFilter = (category: Category) => (entry: M3UEntry) => {
  const full = `${entry.groupTitle} ${entry.name}`.toLowerCase();

  if (category === 'canais') {
    return full.includes('canal') || full.includes('tv') || full.includes('live');
  }
  if (category === 'filmes') {
    return full.includes('filme') || full.includes('movie');
  }
  if (category === 'series') {
    return full.includes('serie') || full.includes('series') || full.includes('tv-show');
  }
  return false;
};

export default function ChannelsExplorer() {
  const [url, setUrl] = useState('https://exemplo.com/lista.m3u');
  const [category, setCategory] = useState<Category | null>(null);
  const [items, setItems] = useState<M3UEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filteredItems = useMemo(() => {
    if (!category) return [];
    return items.filter(categoryFilter(category));
  }, [category, items]);

  const loadEntries = async (selected: Category) => {
    setCategory(selected);
    if (items.length > 0) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/parse-m3u?url=${encodeURIComponent(url)}`);
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error || 'Erro ao buscar lista M3U');
      }
      setItems(payload.data ?? []);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => setCategory(null);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <h2 className="text-3xl font-bold text-center text-purple-iptv mb-4">Explore por Categoria</h2>
        <p className="text-center text-gray-600 mb-8">
          Insira seu link M3U válido e clique em um dos botões para visualizar os cards.
        </p>

        <div className="flex flex-col md:flex-row gap-3 justify-center mb-8">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full md:w-2/3 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-iptv"
            placeholder="https://exemplo.com/lista.m3u"
          />
          <button
            className="bg-purple-iptv text-white px-4 py-2 rounded shadow hover:bg-purple-700"
            onClick={() => loadEntries('canais')}
          >
            Canais TV
          </button>
          <button
            className="bg-yellow-iptv text-purple-iptv px-4 py-2 rounded shadow hover:bg-yellow-600"
            onClick={() => loadEntries('filmes')}
          >
            Filmes
          </button>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600"
            onClick={() => loadEntries('series')}
          >
            Séries
          </button>
        </div>

        {loading && <p className="text-center text-blue-600">Carregando lista...</p>}
        {error && <p className="text-center text-red-600">{error}</p>}

        {category && (
          <div className="relative">
            <div className="fixed inset-0 bg-black/40 z-20" onClick={closeModal} />
            <div className="fixed inset-4 md:inset-20 bg-white rounded-md shadow-xl z-30 overflow-auto p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">{categoryLabel[category]}</h3>
                <button
                  className="text-gray-500 hover:text-gray-800"
                  onClick={closeModal}
                >
                  Fechar
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredItems.length === 0 && !loading ? (
                  <p className="text-gray-600 col-span-full">Nenhum item encontrado para essa categoria.</p>
                ) : (
                  filteredItems.slice(0, 60).map((item) => (
                    <article
                      key={item.url + item.name}
                      className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-lg transition"
                    >
                      <h4 className="font-semibold mb-2 truncate">{item.name}</h4>
                      <p className="text-xs text-gray-500 mb-1">Grupo: {item.groupTitle || 'Indefinido'}</p>
                      <p className="text-xs text-gray-500 mb-2">URL: <a className="text-blue-600" href={item.url} target="_blank" rel="noreferrer">ver</a></p>
                      {item.tvgLogo && (
                        <img src={item.tvgLogo} alt={item.name} className="w-full h-24 object-contain" />
                      )}
                    </article>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}