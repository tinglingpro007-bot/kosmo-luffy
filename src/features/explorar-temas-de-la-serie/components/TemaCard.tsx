import { CalendarRange, MessageSquare, Star, Tag } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { relevanciaLabel, tipoTemaLabel, type TemaExploracion } from "@/domain/temas";
import { contadorResenas } from "../logic";

export interface TemaCardProps {
  tema: TemaExploracion;
  onVerDetalle: (tema: TemaExploracion) => void;
}

export function TemaCard({ tema, onVerDetalle }: TemaCardProps) {
  return (
    <Card className="h-100 d-flex flex-column shadow-sm">
      <CardHeader>
        <div className="d-flex flex-wrap align-items-center gap-2">
          <Badge tone="info">
            <CalendarRange size={12} />
            {tema.temporada}
          </Badge>
          <Badge tone="primary">
            <Tag size={12} />
            {tipoTemaLabel(tema.tipo)}
          </Badge>
        </div>
        <CardTitle className="mt-2">
          <button
            type="button"
            className="btn btn-link p-0 text-start text-decoration-none fw-semibold text-dark"
            onClick={() => onVerDetalle(tema)}
          >
            {tema.nombre}
          </button>
        </CardTitle>
      </CardHeader>
      <CardBody className="pt-1">
        <p className="text-secondary small mb-3">{tema.descripcion}</p>
        <div className="d-flex flex-wrap align-items-center gap-3 text-muted small">
          <span className="d-inline-flex align-items-center gap-1">
            <MessageSquare size={13} />
            {contadorResenas(tema.totalResenas)}
          </span>
          <span className="d-inline-flex align-items-center gap-1">
            <Star size={13} className="text-warning" />
            Relevancia {relevanciaLabel(tema.relevancia)}
          </span>
        </div>
      </CardBody>
      <CardFooter className="mt-auto pt-2">
        <Button variant="outline" size="sm" className="w-100" onClick={() => onVerDetalle(tema)}>
          Ver detalle
        </Button>
      </CardFooter>
    </Card>
  );
}
