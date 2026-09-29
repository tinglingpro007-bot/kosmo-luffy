"use client";

import { useMemo, useState } from "react";
import { BookOpen, Inbox, PenLine, Star, User } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import { PageHeader } from "@/components/ui/page-header";
import { Select } from "@/components/ui/select";
import { Tabs } from "@/components/ui/tabs";
import { Toast, ToastContainer } from "@/components/ui/toast";
import { TIPOS_TEMA, tipoTemaLabel } from "@/domain/temas";
import type { ResenaView } from "@/domain/resenas";
import { formatFecha, sortResenasRecientes, valoracionTexto } from "../logic";
import { ResenaCard } from "./ResenaCard";
import { ResenaForm, type SeguidorOpcion } from "./ResenaForm";

export interface TemaVista {
  id: string;
  nombre: string;
  tipo: string;
}

export interface ResenasViewProps {
  temas: TemaVista[];
  seguidores: SeguidorOpcion[];
  resenas: ResenaView[];
}

type TabId = "explorar" | "escribir";
type ToastState = { variant: "success" | "danger"; title: string; description?: string };

export function ResenasView({ temas, seguidores, resenas }: ResenasViewProps) {
  const [activeTab, setActiveTab] = useState<TabId>("explorar");
  const [tipoFiltro, setTipoFiltro] = useState("todos");
  const [temaFiltro, setTemaFiltro] = useState("todos");
  const [seleccionada, setSeleccionada] = useState<ResenaView | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);

  const filtradas = useMemo(() => {
    return sortResenasRecientes(resenas).filter((resena) => {
      const coincideTipo = tipoFiltro === "todos" || resena.temaTipo === tipoFiltro;
      const coincideTema = temaFiltro === "todos" || resena.temaId === temaFiltro;
      return coincideTipo && coincideTema;
    });
  }, [resenas, tipoFiltro, temaFiltro]);

  return (
    <div className="d-flex flex-column gap-4">
      <PageHeader
        title="Reseñas de temas"
        description="Elige un arco, personaje o producto de One Piece, escribe tu opinión y compártela con la comunidad."
        actions={
          <Badge tone="primary">
            <Star size={13} />
            {resenas.length} {resenas.length === 1 ? "reseña publicada" : "reseñas publicadas"}
          </Badge>
        }
      />

      <Tabs
        items={[
          {
            id: "explorar",
            label: "Explorar reseñas",
            icon: <BookOpen size={16} />,
            badge: resenas.length,
          },
          {
            id: "escribir",
            label: "Escribir reseña",
            icon: <PenLine size={16} />,
          },
        ]}
        activeId={activeTab}
        onChange={(id) => setActiveTab(id as TabId)}
      />

      {activeTab === "explorar" ? (
        <div className="d-flex flex-column gap-3">
          <Card>
            <CardBody className="row g-3 align-items-end">
              <div className="col-12 col-md-4">
                <Label htmlFor="filtroTipo">Categoría</Label>
                <Select
                  id="filtroTipo"
                  value={tipoFiltro}
                  onChange={(event) => setTipoFiltro(event.target.value)}
                >
                  <option value="todos">Todas las categorías</option>
                  {TIPOS_TEMA.map((tipo) => (
                    <option key={tipo} value={tipo}>
                      {tipoTemaLabel(tipo)}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="col-12 col-md-4">
                <Label htmlFor="filtroTema">Tema</Label>
                <Select
                  id="filtroTema"
                  value={temaFiltro}
                  onChange={(event) => setTemaFiltro(event.target.value)}
                >
                  <option value="todos">Todos los temas</option>
                  {temas.map((tema) => (
                    <option key={tema.id} value={tema.id}>
                      {tema.nombre}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="col-12 col-md-4 d-flex align-items-center">
                <span className="text-muted small">
                  {filtradas.length} {filtradas.length === 1 ? "reseña" : "reseñas"} encontradas
                </span>
              </div>
            </CardBody>
          </Card>

          {filtradas.length === 0 ? (
            <EmptyState
              icon={Inbox}
              title="Aún no hay reseñas para esta selección"
              description="Sé el primero en compartir tu opinión sobre este tema de One Piece."
              action={
                <Button onClick={() => setActiveTab("escribir")}>
                  <PenLine size={16} />
                  Escribir una reseña
                </Button>
              }
            />
          ) : (
            <div className="row g-3 row-cols-1 row-cols-md-2 row-cols-lg-3">
              {filtradas.map((resena) => (
                <div key={resena.id} className="col">
                  <ResenaCard resena={resena} onVerDetalle={setSeleccionada} />
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <Card>
          <CardBody className="p-4">
            <h2 className="h5 fw-semibold text-dark mb-1">Nueva reseña</h2>
            <p className="text-muted small mb-4">
              Asocia tu opinión a un tema y, si quieres, añade una valoración de 1 a 5.
            </p>
            <ResenaForm
              temas={temas.map((tema) => ({ id: tema.id, nombre: tema.nombre }))}
              seguidores={seguidores}
              onCreated={({ temaNombre }) => {
                setTemaFiltro("todos");
                setTipoFiltro("todos");
                setActiveTab("explorar");
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

      <Modal
        isOpen={seleccionada !== null}
        onClose={() => setSeleccionada(null)}
        title={seleccionada?.titulo ?? "Detalle de la reseña"}
        size="lg"
      >
        {seleccionada ? (
          <div className="d-flex flex-column gap-3">
            <div className="d-flex align-items-center gap-3 border-bottom pb-3">
              <div
                className="d-flex align-items-center justify-content-center rounded-circle bg-primary-subtle text-primary fw-bold text-uppercase"
                style={{ width: "3rem", height: "3rem" }}
              >
                {seleccionada.autorNombre.charAt(0)}
              </div>
              <div>
                <div className="fw-semibold text-dark d-inline-flex align-items-center gap-1">
                  <User size={15} />
                  {seleccionada.autorNombre}
                </div>
                <div className="text-muted small">
                  {formatFecha(seleccionada.creadaEn)} · {seleccionada.temaNombre}
                </div>
              </div>
            </div>

            <div className="d-flex flex-wrap gap-2">
              <Badge tone="primary">{tipoTemaLabel(seleccionada.temaTipo)}</Badge>
              {valoracionTexto(seleccionada.valoracion) ? (
                <Badge tone="warning">
                  <Star size={12} />
                  {valoracionTexto(seleccionada.valoracion)}
                </Badge>
              ) : (
                <Badge tone="neutral">Sin valoración</Badge>
              )}
            </div>

            <p className="text-secondary mb-0" style={{ whiteSpace: "pre-wrap" }}>
              {seleccionada.cuerpo}
            </p>
          </div>
        ) : null}
      </Modal>

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
