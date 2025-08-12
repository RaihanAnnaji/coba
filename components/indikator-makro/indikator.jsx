'use client'
import React, { useRef, useState, useEffect } from 'react'
import Kartu from './kartu'

export default function Indikator() {
  const scrollContainerRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [dataIndikator, setDataIndikator] = useState([])

  const hitungStatus = (a, b) =>
    parseFloat(b) > parseFloat(a) ? 'naik' : 'turun'

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const handleScroll = () => {
      const index = Math.round(
        container.scrollLeft / (container.firstChild?.offsetWidth || 1)
      )
      setActiveIndex(index)
    }

    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    async function getData() {
      try {
        const res = await fetch('/api/indikator')
        const json = await res.json()
        setDataIndikator(json)
      } catch (err) {
        console.error('Gagal ambil data indikator', err)
      }
    }
    getData()
  }, [])

  return (
    <div className="bg-[#EDFCED]">
      <section className="px-6 py-20 max-w-7xl mx-auto">
        {/* Judul & Subjudul */}
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-[#01BBA6]">
            Indikator Makro
          </h2>
          <p className="text-slate-800 mt-1">
            Capaian Kabupaten Kulon Progo
          </p>
        </div>

        {/* Desktop */}
        <div className="hidden md:grid md:grid-cols-4 gap-6">
          {dataIndikator.map((d) => (
            <Kartu
              key={d.id}
              status={hitungStatus(d.persenA, d.persenB)}
              tahunA={d.tahunA}
              persenA={d.persenA}
              tahunB={d.tahunB}
              persenB={d.persenB}
              caption={d.nama}
            />
          ))}
        </div>

        {/* Mobile */}
        <div className="md:hidden">
          <div
            ref={scrollContainerRef}
            className="card-wrapper flex gap-6 overflow-x-auto snap-x snap-mandatory px-4 -mx-4 scroll-smooth"
          >
            {dataIndikator.map((d) => (
              <div
                key={d.id}
                className="snap-center shrink-0 w-full max-w-sm mx-auto"
              >
                <Kartu
                  status={hitungStatus(d.persenA, d.persenB)}
                  tahunA={d.tahunA}
                  persenA={d.persenA}
                  tahunB={d.tahunB}
                  persenB={d.persenB}
                  caption={d.nama}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-2 mt-4">
            {dataIndikator.map((_, i) => (
              <span
                key={i}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === activeIndex ? 'bg-[#01BBA6]' : 'bg-slate-400/30'
                }`}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
