"use client";

import { useState, useTransition, type FormEvent } from "react";
import { Send } from "lucide-react";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { VALORACION_MAX, VALORACION_MIN } from "@/domain/resenas";
import { createResenaAction } from "../actions";
import { validateNuevaResena, type CampoResena } from "../logic";

export interface TemaOpcion {
  id: string;
  nombre: string;
}

export interface SeguidorOpcion {
  id: string;
  nombreUsuario: string;
}

export interface PublicarResenaFormProps {
  temas: TemaOpcion[];
  seguidores: SeguidorOpcion[];
  onCreated: (detalle: { temaId: string; temaNombre: string }) => void;
}

type FieldErrors = Partial<Record<CampoResena, string>>;

const VALORACION_OPCIONES = Array.from(
  { length: VALORACION_MAX - VALORACION_MIN + 1 },
  (_, index) => VALORACION_MIN + index,
);

export function PublicarResenaForm({ temas, seguidores, onCreated }: PublicarResenaFormProps) {
  const [autorId, setAutorId] = useState(seguidores[0]?.id ?? "");
  const [temaId, setTemaId] = useState("");
  const [titulo, setTitulo] = useState("");
  const [cuerpo, setCuerpo] = useState("");
  const [valoracion, setValoracion] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFieldErrors({});
    setMensaje(null);

    const input = { autorId, temaId, titulo, cuerpo, valoracion };
    const validacion = validateNuevaResena(input);
    if (!validacion.valido) {
      const errores: FieldErrors = {};
      validacion.errores.forEach((error) => {
        errores[error.campo] = error.mensaje;
      });
      setFieldErrors(errores);
      setMensaje(validacion.mensaje ?? null);
      return;
    }

    startTransition(async () => {
      const resultado = await createResenaAction(input);
      if (!resultado.success) {
        const errores: FieldErrors = {};
        resultado.fieldErrors?.forEach((error) => {
          errores[error.campo] = error.mensaje;
        });
        setFieldErrors(errores);
        setMensaje(resultado.error ?? "No se pudo publicar la reseña.");
        return;
      }

      const temaNombre = temas.find((tema) => tema.id === temaId)?.nombre ?? "";
      onCreated({ temaId, temaNombre });
      setTitulo("");
      setCuerpo("");
      setValoracion("");
      setFieldErrors({});
      setMensaje(null);
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="row g-3">
      {mensaje ? (
        <div className="col-12">
          <Alert variant="danger" title="Revisa el formulario">
            {mensaje}
          </Alert>
        </div>
      ) : null}

      <div className="col-12 col-md-6">
        <Label htmlFor="m-autorId">Firma la reseña</Label>
        <Select
          id="m-autorId"
          value={autorId}
          isInvalid={Boolean(fieldErrors.autor)}
          onChange={(event) => setAutorId(event.target.value)}
        >
          {seguidores.map((seguidor) => (
            <option key={seguidor.id} value={seguidor.id}>
              {seguidor.nombreUsuario}
            </option>
          ))}
        </Select>
        {fieldErrors.autor ? (
          <div className="invalid-feedback d-block">{fieldErrors.autor}</div>
        ) : (
          <div className="form-text">Toda reseña queda firmada por un integrante de la comunidad.</div>
        )}
      </div>

      <div className="col-12 col-md-6">
        <Label htmlFor="m-temaId">Tema de la serie o producto</Label>
        <Select
          id="m-temaId"
          value={temaId}
          isInvalid={Boolean(fieldErrors.tema)}
          onChange={(event) => setTemaId(event.target.value)}
        >
          <option value="">Selecciona un tema…</option>
          {temas.map((tema) => (
            <option key={tema.id} value={tema.id}>
              {tema.nombre}
            </option>
          ))}
        </Select>
        {fieldErrors.tema ? (
          <div className="invalid-feedback d-block">{fieldErrors.tema}</div>
        ) : null}
      </div>

      <div className="col-12">
        <Label htmlFor="m-titulo">Título</Label>
        <Input
          id="m-titulo"
          value={titulo}
          isInvalid={Boolean(fieldErrors.titulo)}
          placeholder="Por qué recomiendo este tema"
          onChange={(event) => setTitulo(event.target.value)}
        />
        {fieldErrors.titulo ? (
          <div className="invalid-feedback d-block">{fieldErrors.titulo}</div>
        ) : null}
      </div>

      <div className="col-12">
        <Label htmlFor="m-cuerpo">Tu opinión</Label>
        <Textarea
          id="m-cuerpo"
          rows={5}
          value={cuerpo}
          isInvalid={Boolean(fieldErrors.cuerpo)}
          placeholder="Escribe qué te pareció el tema y por qué lo recomendarías."
          onChange={(event) => setCuerpo(event.target.value)}
        />
        {fieldErrors.cuerpo ? (
          <div className="invalid-feedback d-block">{fieldErrors.cuerpo}</div>
        ) : null}
      </div>

      <div className="col-12 col-md-6">
        <Label htmlFor="m-valoracion">Valoración (opcional)</Label>
        <Select
          id="m-valoracion"
          value={valoracion}
          isInvalid={Boolean(fieldErrors.valoracion)}
          onChange={(event) => setValoracion(event.target.value)}
        >
          <option value="">Sin valoración</option>
          {VALORACION_OPCIONES.map((valor) => (
            <option key={valor} value={valor}>
              {valor} / {VALORACION_MAX}
            </option>
          ))}
        </Select>
        {fieldErrors.valoracion ? (
          <div className="invalid-feedback d-block">{fieldErrors.valoracion}</div>
        ) : null}
      </div>

      <div className="col-12 d-flex justify-content-end">
        <Button type="submit" disabled={isPending} className="px-4">
          <Send size={16} />
          {isPending ? "Publicando…" : "Publicar reseña"}
        </Button>
      </div>
    </form>
  );
}
