'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Phone, Heart, WheatOff, Info, Lock } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  disponible: boolean;
}

export default function MenuPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categoriaSel, setCategoriaSel] = useState<string>('Todos');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .eq('disponible', true)
      .order('nombre', { ascending: true });

    if (!error && data) {
      setProductos(data);
    }
    setLoading(false);
  };

  const categorias = ['Todos', ...Array.from(new Set(productos.map((p) => p.categoria)))];

  const filtrados = categoriaSel === 'Todos' 
    ? productos 
    : productos.filter((p) => p.categoria === categoriaSel);

  return (
    <main className="max-w-md mx-auto min-h-screen pb-6 shadow-2xl bg-[#F9F6EE] relative overflow-hidden">
      
      {/* Header Institucional */}
      <header className="relative pt-10 pb-6 px-4 text-center border-b-[6px] border-[#E35D20]">
        <div className="absolute top-0 left-0 w-full h-3 bg-[#0B2545]"></div>
        <div className="absolute top-3 left-0 w-full h-1 bg-[#E35D20]"></div>

        {/* Logo */}
        <div className="mx-auto w-40 h-40 relative mb-4 flex justify-center">
          <Image 
            src="/logo.png" 
            alt="Las María's Logo" 
            width={160} 
            height={160}
            className="object-contain rounded-full shadow-lg border-4 border-[#E35D20]/20 bg-[#F9F6EE]"
            priority 
          />
        </div>

        <h1 className="text-4xl font-black text-[#0B2545] tracking-wide mb-0 drop-shadow-sm">
          Las María's
        </h1>
        <p className="text-3xl text-[#E35D20] font-bold mt-1 mb-2 italic">
          Sabores sin Gluten
        </p>
      </header>

      {/* Frase / Banner en Tarjeta Estética */}
      <section className="px-5 py-6 mt-2 mb-4">
        <div className="bg-white p-8 rounded-3xl shadow-md border border-[#E35D20]/10 relative text-center overflow-hidden">
          <div className="relative z-10">
            <WheatOff className="w-6 h-6 text-[#E35D20] mx-auto mb-3 opacity-80" />
            <p className="text-xl text-[#0B2545] font-bold leading-snug">
              "Ser <span className="text-3xl font-black block my-2 tracking-wide">CELÍACO</span> no es difícil,<br/>
              <span className="text-[#E35D20] text-3xl block my-2 drop-shadow-sm italic">lo difícil es</span>
              explicárselo a los demás."
            </p>
          </div>
        </div>
      </section>

      {/* Filtro de Categorías */}
      {categorias.length > 1 && (
        <nav className="flex gap-2 overflow-x-auto px-5 py-3 mb-4 no-scrollbar">
          {categorias.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoriaSel(cat)}
              className={`px-5 py-2.5 rounded-2xl text-sm font-bold whitespace-nowrap transition-all duration-200 ${
                categoriaSel === cat
                  ? 'bg-[#E35D20] text-white shadow-md transform scale-105 border-2 border-[#E35D20]'
                  : 'bg-transparent text-[#0B2545] border-2 border-[#0B2545]/10 hover:border-[#E35D20]/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </nav>
      )}

      {/* Lista de Productos */}
      <section className="px-5 space-y-4">
        {loading ? (
          <div className="text-center py-12 text-[#E35D20] flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-4 border-[#E35D20] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-bold mt-2">Preparando el menú...</p>
          </div>
        ) : filtrados.length === 0 ? (
          <div className="text-center py-12 bg-[#E35D20]/5 rounded-2xl border border-[#E35D20]/20">
            <Info className="w-8 h-8 mx-auto text-[#E35D20] mb-2" />
            <p className="text-sm text-[#0B2545] font-bold">No hay productos disponibles por el momento.</p>
          </div>
        ) : (
          filtrados.map((producto) => (
            <article
              key={producto.id}
              className="bg-[#FFFDF9] p-4 rounded-2xl shadow-sm border-l-[6px] border-l-[#E35D20] border-y border-r border-[#0B2545]/5 flex justify-between items-center relative overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="pr-3 z-10 w-2/3">
                <h3 className="font-bold text-[#0B2545] text-xl leading-tight">{producto.nombre}</h3>
                {producto.descripcion && (
                  <p className="text-sm text-[#0B2545]/70 mt-1.5 leading-relaxed">{producto.descripcion}</p>
                )}
                <span className="inline-block mt-2.5 text-[11px] font-black uppercase tracking-wider text-[#E35D20] bg-[#E35D20]/10 px-2 py-1 rounded-md">
                  {producto.categoria}
                </span>
              </div>
              <div className="text-right min-w-[90px] z-10">
                <span className="text-3xl font-black text-[#E35D20] block">
                  ${Number(producto.precio).toLocaleString('es-AR')}
                </span>
              </div>
            </article>
          ))
        )}
      </section>

      {/* Footer y Contacto */}
      <footer className="mt-14 pt-8 pb-4 border-t-[3px] border-dashed border-[#E35D20]/40 text-center px-4 space-y-3">
        <div className="flex justify-center mb-2">
          <Heart className="w-6 h-6 text-[#E35D20] fill-[#E35D20]" />
        </div>
        <p className="font-black text-2xl text-[#0B2545]">¡Te esperamos en el Festival de Música Country de San Pedro!</p>
        <p className="text-sm text-[#0B2545]/70 font-bold max-w-[250px] mx-auto">
          Acercate con tu pedido en mente para agilizar la fila.
        </p>
        
        <div className="flex justify-center gap-6 text-[#0B2545] pt-4">
          <a href="https://wa.me/5493329552929" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-[#E35D20] transition-colors font-bold text-base bg-white px-4 py-2 rounded-full shadow-sm border border-[#0B2545]/10">
            <Phone className="w-4 h-4 text-[#E35D20]" /> Whatsapp
          </a>
          <a href="https://instagram.com/las_marias_singluten" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-[#E35D20] transition-colors font-bold text-base bg-white px-4 py-2 rounded-full shadow-sm border border-[#0B2545]/10">
            <svg className="w-4 h-4 fill-[#E35D20]" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            Instagram
          </a>
        </div>

        <div className="pt-8 flex justify-center">
          <Link 
            href="/admin" 
            className="flex items-center gap-1 text-[11px] uppercase font-bold tracking-widest text-[#0B2545]/30 hover:text-[#E35D20] transition-colors"
          >
            <Lock className="w-3 h-3" /> Panel Admin
          </Link>
        </div>
      </footer>
    </main>
  );
}