import { CalendarDays, Star, Tag, User } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { tipoTemaLabel } from "@/domain/temas";
import type { ResenaView } from "@/domain/resenas";
import { formatFecha, valoracionTexto } from "../logic";

export interface ResenaCardProps {
  resena: ResenaView;
  onVerDetalle: (resena: ResenaView) => void;
}

function extracto(cuerpo: string, max = 150): string {
  return cuerpo.length > max ? `${cuerpo.slice(0, max).trimEnd()}…` : cuerpo;
}

export function ResenaCard({ resena, onVerDetalle }: ResenaCardProps) {
  const valoracion = valoracionTexto(resena.valoracion);

  return (
    <Card className="h-100 d-flex flex-column shadow-sm">
      <CardHeader>
        <div className="d-flex align-items-center justify-content-between gap-2">
          <Badge tone="primary">
            <Tag size={12} />
            {tipoTemaLabel(resena.temaTipo)}
          </Badge>
          {valoracion ? (
            <Badge tone="warning">
              <Star size={12} />
              {valoracion}
            </Badge>
          ) : null}
        </div>
        <CardTitle className="mt-2">{resena.titulo}</CardTitle>
        <p className="text-primary fw-medium small mb-1">{resena.temaNombre}</p>
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
      </CardHeader>
      <CardBody className="pt-2">
        <p className="text-secondary small mb-0">{extracto(resena.cuerpo)}</p>
      </CardBody>
      <CardFooter className="mt-auto">
        <Button variant="outline" size="sm" className="w-100" onClick={() => onVerDetalle(resena)}>
          Ver detalle
        </Button>
      </CardFooter>
    </Card>
  );
}
