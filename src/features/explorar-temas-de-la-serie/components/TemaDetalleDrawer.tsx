import { CalendarDays, Inbox, MessageSquare, Star, Tag, User } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Drawer } from "@/components/ui/drawer";
import { EmptyState } from "@/components/ui/empty-state";
import type { ResenaView } from "@/domain/resenas";
import { relevanciaLabel, tipoTemaLabel, type TemaExploracion } from "@/domain/temas";
import { contadorResenas, formatFecha } from "../logic";

export interface TemaDetalleDrawerProps {
  tema: TemaExploracion | null;
  resenas: ResenaView[];
  onClose: () => void;
}

export function TemaDetalleDrawer({ tema, resenas, onClose }: TemaDetalleDrawerProps) {
  if (!tema) return null;

  const resenasTema = resenas
    .filter((resena) => resena.temaId === tema.id)
    .sort((a, b) => new Date(b.creadaEn).getTime() - new Date(a.creadaEn).getTime());

  return (
    <Drawer
      isOpen
      onClose={onClose}
      title={tema.nombre}
      description={`${tema.temporada} · Relevancia ${relevanciaLabel(tema.relevancia)}`}
    >
      <div className="d-flex flex-column gap-3">
        <div className="d-flex flex-wrap gap-2">
          <Badge tone="primary">
            <Tag size={12} />
            {tipoTemaLabel(tema.tipo)}
          </Badge>
          <Badge tone="info">
            <MessageSquare size={12} />
            {contadorResenas(tema.totalResenas)}
          </Badge>
        </div>

        <p className="text-secondary mb-0">{tema.descripcion}</p>

        <hr className="my-1" />

        <h3 className="h6 fw-semibold text-dark mb-0">Reseñas de la comunidad</h3>

        {resenasTema.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title="Aún no hay reseñas sobre este tema"
            description="Sé el primero en compartir tu opinión desde la pestaña Miembro de la comunidad."
          />
        ) : (
          <div className="d-flex flex-column gap-3">
            {resenasTema.map((resena) => (
              <div key={resena.id} className="border rounded p-3 bg-white shadow-sm">
                <div className="d-flex align-items-center justify-content-between gap-2">
                  <span className="fw-semibold text-dark">{resena.titulo}</span>
                  {resena.valoracion !== null ? (
                    <Badge tone="warning">
                      <Star size={12} />
                      {resena.valoracion} / 5
                    </Badge>
                  ) : null}
                </div>
                <p className="text-secondary small mb-2 mt-2" style={{ whiteSpace: "pre-wrap" }}>
                  {resena.cuerpo}
                </p>
                <div className="d-flex flex-wrap align-items-center gap-3 text-muted small">
                  <span className="d-inline-flex align-items-center gap-1">
                    <User size={13} />
                    {resena.autorNombre}
                  </span>
                  <span className="d-inline-flex align-items-center gap-1">
                    <CalendarDays size={13} />
                    {formatFecha(resena.creadaEn)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Drawer>
  );
}
