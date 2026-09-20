'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Lock, Trash2, PlusCircle, ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';
import Link from 'next/link';

interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  disponible: boolean;
}

export default function AdminPage() {
  const [autenticado, setAutenticado] = useState(false);
  const [password, setPassword] = useState('');
  const [productos, setProductos] = useState<Producto[]>([]);
  
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [categoria, setCategoria] = useState('Salado');

  // Estado para la nueva notificación flotante
  const [notificacion, setNotificacion] = useState({ mostrar: false, mensaje: '', tipo: 'exito' });

  const CLAVE_SECRETA = 'LasMarias2026';

  const mostrarNotificacion = (mensaje: string, tipo: 'exito' | 'error' = 'exito') => {
    setNotificacion({ mostrar: true, mensaje, tipo });
    setTimeout(() => {
      setNotificacion({ mostrar: false, mensaje: '', tipo: 'exito' });
    }, 3000);
  };

  const login = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === CLAVE_SECRETA) {
      setAutenticado(true);
      fetchProductos();
    } else {
      mostrarNotificacion('Contraseña incorrecta', 'error');
    }
  };

  const fetchProductos = async () => {
    const { data } = await supabase.from('productos').select('*').order('nombre');
    if (data) setProductos(data);
  };

  const agregarProducto = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('productos').insert([
      { nombre, precio: Number(precio), categoria, disponible: true, descripcion: '' }
    ]);
    
    if (!error) {
      setNombre('');
      setPrecio('');
      fetchProductos();
      mostrarNotificacion('¡Producto agregado con éxito!');
    } else {
      mostrarNotificacion('Error al agregar el producto', 'error');
    }
  };

  const borrarProducto = async (id: string) => {
    if (window.confirm('¿Seguro que querés borrar este producto? Esta acción no se puede deshacer.')) {
      await supabase.from('productos').delete().eq('id', id);
      fetchProductos();
    }
  };

  // Componente visual de la notificación
  const NotificacionFlotante = () => {
    if (!notificacion.mostrar) return null;
    return (
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-bounce">
        <div className={`flex items-center gap-2 px-6 py-3 rounded-full shadow-xl text-white font-bold border-2 ${notificacion.tipo === 'exito' ? 'bg-green-600 border-green-500' : 'bg-red-600 border-red-500'}`}>
          {notificacion.tipo === 'exito' ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
          {notificacion.mensaje}
        </div>
      </div>
    );
  };

  if (!autenticado) {
    return (
      <main className="min-h-screen bg-[#F9F6EE] flex flex-col items-center justify-center p-4 relative">
        <NotificacionFlotante />
        
        <Link href="/" className="absolute top-6 left-6 flex items-center gap-2 text-[#0B2545] font-bold hover:text-[#E35D20] transition-colors">
          <ArrowLeft className="w-5 h-5" /> Volver a la tienda
        </Link>

        <form onSubmit={login} className="bg-white p-8 rounded-2xl shadow-lg border-t-[6px] border-[#E35D20] text-center max-w-sm w-full mt-10">
          <Lock className="w-12 h-12 text-[#E35D20] mx-auto mb-4" />
          <h1 className="text-3xl font-black text-[#0B2545] mb-6">Acceso Privado</h1>
          <input
            type="password"
            placeholder="Ingresá tu clave"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 mb-4 border-2 border-gray-200 rounded-xl focus:border-[#E35D20] outline-none text-center font-bold text-lg"
          />
          <button type="submit" className="w-full bg-[#E35D20] text-white font-bold py-3 rounded-xl hover:bg-[#c94d18] transition-colors shadow-md">
            Entrar al Panel
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F9F6EE] p-6 pb-20 max-w-lg mx-auto shadow-2xl relative">
      <NotificacionFlotante />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-black text-[#0B2545]">Gestión de Menú</h1>
        <Link href="/" className="flex items-center gap-1 text-[#E35D20] font-bold text-sm bg-white px-3 py-1.5 rounded-full shadow-sm border border-gray-200 hover:bg-[#E35D20] hover:text-white transition-all">
           Ver Tienda
        </Link>
      </div>

      <form onSubmit={agregarProducto} className="bg-white p-5 rounded-2xl shadow-sm border-2 border-[#E35D20]/20 mb-8 space-y-4">
        <h2 className="font-bold text-[#E35D20] flex items-center gap-2 text-xl">
          <PlusCircle className="w-6 h-6" /> Nuevo Producto
        </h2>
        <input 
          required 
          type="text" 
          placeholder="Nombre del producto" 
          value={nombre} 
          onChange={(e) => setNombre(e.target.value)} 
          className="w-full p-3 border-2 border-gray-100 rounded-xl focus:border-[#E35D20] outline-none font-bold" 
        />
        <div className="flex gap-4">
          <div className="w-1/2 relative">
            <span className="absolute left-3 top-3.5 font-bold text-gray-400">$</span>
            <input 
              required 
              type="number" 
              placeholder="Precio" 
              value={precio} 
              onChange={(e) => setPrecio(e.target.value)} 
              className="w-full p-3 pl-8 border-2 border-gray-100 rounded-xl focus:border-[#E35D20] outline-none font-bold" 
            />
          </div>
          <select 
            value={categoria} 
            onChange={(e) => setCategoria(e.target.value)} 
            className="w-1/2 p-3 border-2 border-gray-100 rounded-xl focus:border-[#E35D20] outline-none bg-white font-bold text-gray-700"
          >
            <option value="Salado">Salado</option>
            <option value="Dulce">Dulce</option>
            <option value="Bebidas">Bebidas</option>
          </select>
        </div>
        <button type="submit" className="w-full bg-[#0B2545] text-white font-bold py-3 rounded-xl hover:bg-[#123661] transition-colors shadow-md text-lg">
          Guardar Producto
        </button>
      </form>

      <h2 className="font-bold text-[#0B2545] mb-4 text-2xl">Menú Actual ({productos.length})</h2>
      <div className="space-y-3">
        {productos.map(p => (
          <div key={p.id} className="bg-white p-4 rounded-2xl shadow-sm flex justify-between items-center border-l-4 border-l-[#E35D20]">
            <div>
              <p className="font-bold text-[#0B2545] text-xl">{p.nombre}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[#E35D20] font-black text-lg">${p.precio}</span>
                <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-500 font-bold uppercase">{p.categoria}</span>
              </div>
            </div>
            <button onClick={() => borrarProducto(p.id)} className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-colors">
              <Trash2 className="w-6 h-6" />
            </button>
          </div>
        ))}
        {productos.length === 0 && (
          <p className="text-center text-gray-500 italic font-bold py-8">No hay productos cargados.</p>
        )}
      </div>
    </main>
  );
}