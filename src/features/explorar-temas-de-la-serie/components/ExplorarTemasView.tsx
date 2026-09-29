"use client";

import { useEffect, useMemo, useState } from "react";
import { Compass, Layers, PenLine, RotateCcw, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/ui/page-header";
import { Select } from "@/components/ui/select";
import { Tabs } from "@/components/ui/tabs";
import { Toast, ToastContainer } from "@/components/ui/toast";
import type { ResenaView } from "@/domain/resenas";
import {
  TODAS_LAS_TEMPORADAS,
  type CriterioOrden,
  type TemaExploracion,
} from "@/domain/temas";
import { fetchTemasResumenAction } from "../actions";
import { aplicarConteos, construirListado, MSG_SIN_RESULTADOS } from "../logic";
import { PublicarResenaForm, type SeguidorOpcion } from "./PublicarResenaForm";
import { TemaCard } from "./TemaCard";
import { TemaDetalleDrawer } from "./TemaDetalleDrawer";

export interface ExplorarTemasViewProps {
  temas: TemaExploracion[];
  resenas: ResenaView[];
  seguidores: SeguidorOpcion[];
  temporadas: readonly string[];
}

type TabId = "visitante" | "miembro";
type ToastState = { variant: "success" | "danger"; title: string; description?: string };

const INTERVALO_ACTUALIZACION_MS = 8000;

export function ExplorarTemasView({
  temas,
  resenas,
  seguidores,
  temporadas,
}: ExplorarTemasViewProps) {
  const [activeTab, setActiveTab] = useState<TabId>("visitante");
  const [temporada, setTemporada] = useState<string>(TODAS_LAS_TEMPORADAS);
  const [orden, setOrden] = useState<CriterioOrden>("alfabetico");
  const [seleccionado, setSeleccionado] = useState<TemaExploracion | null>(null);
  const [temasState, setTemasState] = useState<TemaExploracion[]>(temas);
  const [toast, setToast] = useState<ToastState | null>(null);

  // ponytail: polling simple cada 8s; usar SSE si se necesita tiempo real estricto.
  useEffect(() => {
    let activo = true;
    const sincronizar = async () => {
      const resultado = await fetchTemasResumenAction();
      if (activo && resultado.success) {
        setTemasState((previos) => aplicarConteos(previos, resultado.conteos));
      }
    };
    const intervalo = setInterval(sincronizar, INTERVALO_ACTUALIZACION_MS);
    return () => {
      activo = false;
      clearInterval(intervalo);
    };
  }, []);

  const listado = useMemo(
    () => construirListado(temasState, { temporada, orden }),
    [temasState, temporada, orden],
  );

  const totalResenas = useMemo(
    () => temasState.reduce((acumulado, tema) => acumulado + tema.totalResenas, 0),
    [temasState],
  );

  const restablecerFiltros = () => {
    setTemporada(TODAS_LAS_TEMPORADAS);
    setOrden("alfabetico");
  };

  const seleccionadoActual = seleccionado
    ? temasState.find((tema) => tema.id === seleccionado.id) ?? seleccionado
    : null;

  return (
    <div className="d-flex flex-column gap-4">
      <PageHeader
        title="Explorar temas de la serie"
        description="Arcos, personajes y productos de One Piece. Filtra por temporada, ordena por relevancia y abre cada tema para leer qué opina la comunidad."
        actions={
          <div className="d-flex flex-wrap gap-2">
            <Badge tone="primary">
              <Layers size={13} />
              {temasState.length} {temasState.length === 1 ? "tema" : "temas"}
            </Badge>
            <Badge tone="info">
              <Sparkles size={13} />
              {totalResenas} {totalResenas === 1 ? "reseña" : "reseñas"}
            </Badge>
          </div>
        }
      />

      <Tabs
        items={[
          {
            id: "visitante",
            label: "Visitante",
            icon: <Compass size={16} />,
            badge: temasState.length,
          },
          {
            id: "miembro",
            label: "Miembro de la comunidad",
            icon: <PenLine size={16} />,
          },
        ]}
        activeId={activeTab}
        onChange={(id) => setActiveTab(id as TabId)}
      />

      {activeTab === "visitante" ? (
        <div className="d-flex flex-column gap-3">
          <Card>
            <CardBody className="row g-3 align-items-end">
              <div className="col-12 col-md-4">
                <Label htmlFor="filtroTemporada">Temporada</Label>
                <Select
                  id="filtroTemporada"
                  value={temporada}
                  onChange={(event) => setTemporada(event.target.value)}
                >
                  <option value={TODAS_LAS_TEMPORADAS}>Todas las temporadas</option>
                  {temporadas.map((temporadaOpcion) => (
                    <option key={temporadaOpcion} value={temporadaOpcion}>
                      {temporadaOpcion}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="col-12 col-md-4">
                <Label htmlFor="ordenTemas">Ordenar por</Label>
                <Select
                  id="ordenTemas"
                  value={orden}
                  onChange={(event) => setOrden(event.target.value as CriterioOrden)}
                >
                  <option value="alfabetico">Ordenar alfabéticamente</option>
                  <option value="relevancia">Ordenar por relevancia</option>
                </Select>
              </div>
              <div className="col-12 col-md-4 d-flex align-items-center justify-content-between gap-2">
                <span className="text-muted small">
                  {listado.length} {listado.length === 1 ? "tema encontrado" : "temas encontrados"}
                </span>
                <Button variant="light" size="sm" onClick={restablecerFiltros}>
                  <RotateCcw size={15} />
                  Restablecer filtros
                </Button>
              </div>
            </CardBody>
          </Card>

          {listado.length === 0 ? (
            <EmptyState
              icon={RotateCcw}
              title={MSG_SIN_RESULTADOS}
              description="Prueba con otra temporada o vuelve a la lista completa de temas."
              action={
                <Button onClick={restablecerFiltros}>
                  <RotateCcw size={16} />
                  Restablecer filtros
                </Button>
              }
            />
          ) : (
            <div className="row g-3 row-cols-1 row-cols-md-2 row-cols-lg-3">
              {listado.map((tema) => (
                <div key={tema.id} className="col">
                  <TemaCard tema={tema} onVerDetalle={setSeleccionado} />
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <Card>
          <CardBody className="p-4">
            <h2 className="h5 fw-semibold text-dark mb-1">Publicar una reseña</h2>
            <p className="text-muted small mb-4">
              Como miembro de la comunidad puedes aportar tu opinión sobre cualquier tema. El
              contador de reseñas del listado se actualiza automáticamente.
            </p>
            <PublicarResenaForm
              temas={temasState.map((tema) => ({ id: tema.id, nombre: tema.nombre }))}
              seguidores={seguidores}
              onCreated={({ temaId, temaNombre }) => {
                setTemasState((previos) =>
                  previos.map((tema) =>
                    tema.id === temaId ? { ...tema, totalResenas: tema.totalResenas + 1 } : tema,
                  ),
                );
                setActiveTab("visitante");
                setToast({
                  variant: "success",
                  title: "Reseña publicada",
                  description: `Tu reseña sobre "${temaNombre}" ya está visible para la comunidad.`,
                });
              }}
            />
          </CardBody>
        </Card>
      )}

      <TemaDetalleDrawer
        tema={seleccionadoActual}
        resenas={resenas}
        onClose={() => setSeleccionado(null)}
      />

      <ToastContainer>
        {toast ? (
          <Toast
            variant={toast.variant}
            title={toast.title}
            description={toast.description}
            onClose={() => setToast(null)}
          />
        ) : null}
      </ToastContainer>
    </div>
  );
}
