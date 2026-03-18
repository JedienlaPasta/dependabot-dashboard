"use client";

import { useState, useMemo, useEffect } from "react";
import Dropdown from "./Dropdown";
import { Copy } from "lucide-react";
import CopyToClipboardButton from "./CopyToClipboardButton";

const STATE_OPTIONS = [
  { value: "open", label: "Abiertas" },
  { value: "closed", label: "Cerradas (Fixed/Dismissed)" },
  { value: "Todos", label: "Todas" },
];

const formatDate = (dateString: string | null): string => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleString("es-ES", {
    dateStyle: "long",
    timeStyle: "short",
  });
};

export default function DashboardClient({
  initialAlerts,
  repos,
}: {
  initialAlerts: any[];
  repos: string[];
}) {
  const [repoFilter, setRepoFilter] = useState("Todos");
  const [stateFilter, setStateFilter] = useState("open");
  const [selectedAlert, setSelectedAlert] = useState<any | null>(null);

  const REPO_OPTIONS = repos.map((repo) => ({
    value: repo,
    label: repo,
  }));

  useEffect(() => {
    if (selectedAlert) {
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = "15px";
    } else {
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "0px";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedAlert]);

  // Filtrado reactivo
  const filteredAlerts = useMemo(() => {
    return initialAlerts.filter((alert) => {
      const matchRepo =
        repoFilter === "Todos" || alert.repository === repoFilter;
      const matchState =
        stateFilter === "Todos" ||
        alert.state === stateFilter ||
        (stateFilter === "closed" &&
          (alert.state === "fixed" || alert.state === "dismissed"));

      return matchRepo && matchState;
    });
  }, [initialAlerts, repoFilter, stateFilter]);

  const orderedAlerts = [...filteredAlerts].sort((a, b) => {
    const dateA = a.fixed_at || a.dismissed_at || a.created_at;
    const dateB = b.fixed_at || b.dismissed_at || b.created_at;
    return new Date(dateB).getTime() - new Date(dateA).getTime();
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-red-500 border-red-500";
      case "high":
        return "text-orange-500 border-orange-500";
      case "medium":
        return "text-yellow-500 border-yellow-500";
      case "low":
        return "text-zinc-500 border-zinc-500";
      default:
        return "text-zinc-700 border-zinc-700";
    }
  };

  const getStateColor = (state: string) => {
    switch (state) {
      case "open":
        return "text-red-400 bg-red-400/10 border-red-400/20";
      case "fixed":
        return "text-green-400 bg-green-400/10 border-green-400/20";
      case "dismissed":
        return "text-zinc-400 bg-zinc-400/10 border-zinc-400/20";
      default:
        return "text-zinc-400 bg-zinc-800";
    }
  };

  return (
    <main className="min-h-screen p-8 bg-zinc-950 text-zinc-100 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 border-b border-zinc-800 pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Panel de Seguridad Local
            </h1>
            <p className="text-zinc-400 mt-2 text-sm">
              Monitoreando {repos.length} repositorios • {filteredAlerts.length}{" "}
              alertas mostradas
            </p>
          </div>

          <div className="flex gap-4">
            <Dropdown
              label="Estado"
              value={stateFilter}
              onChange={setStateFilter}
              options={STATE_OPTIONS}
            />

            <Dropdown
              label="Repositorio"
              value={repoFilter}
              onChange={setRepoFilter}
              options={REPO_OPTIONS}
            />
          </div>
        </header>

        {orderedAlerts.length === 0 ? (
          <div className="p-16 text-center bg-zinc-900/50 border border-zinc-800 rounded-2xl text-zinc-400">
            No se encontraron alertas para los filtros seleccionados.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-900/30 shadow-xl">
            <table className="w-[1278px] text-left border-collapse">
              <thead>
                <tr className="bg-zinc-900/80 border-b border-zinc-800 text-xs text-zinc-500 uppercase tracking-wider grid grid-cols-24">
                  <th className="p-5 col-span-10 font-semibold">
                    Alerta / Repositorio
                  </th>
                  <th className="p-5 col-span-3 font-semibold min-w-28 text-center">
                    Estado
                  </th>
                  <th className="p-5 col-span-3 font-semibold min-w-28 text-center">
                    Severidad
                  </th>
                  <th className="p-5 col-span-4 font-semibold min-w-52">
                    Creada
                  </th>
                  <th className="p-5 col-span-4 font-semibold min-w-52">
                    Arreglada
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {orderedAlerts.map((alert: any) => (
                  <tr
                    key={alert.html_url}
                    onClickCapture={() => console.log(alert.number)}
                    className="hover:bg-zinc-800/60 transition-colors cursor-pointer group grid grid-cols-24"
                    onClick={() => setSelectedAlert(alert)}
                  >
                    <td className="p-5 col-span-10">
                      <div className="flex items-center gap-3 mb-0.5">
                        <div className="font-mono text-xs text-indigo-400">
                          {alert.repository}
                        </div>
                        <div className="text-zinc-600">•</div>
                        <div className="font-mono text-sm font-semibold text-zinc-200">
                          {alert.security_vulnerability.package.name}
                        </div>
                      </div>
                      <div
                        className="text-sm text-white group-hover:text-indigo-200 transition-colors font-semibold line-clamp-2"
                        title={alert.security_advisory.summary}
                      >
                        {alert.security_advisory.summary}
                      </div>
                    </td>
                    <td className="p-5 col-span-3 min-w-28 flex items-center justify-center">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium border capitalize ${getStateColor(alert.state)}`}
                      >
                        {alert.state}
                      </span>
                    </td>
                    <td className="p-5 col-span-3 min-w-28 flex items-center justify-center">
                      <span
                        className={`px-2.5 py-1 rounded text-xs font-bold uppercase border ${getSeverityColor(alert.security_vulnerability.severity)}`}
                      >
                        {alert.security_vulnerability.severity}
                      </span>
                    </td>
                    <td className="p-5 col-span-4 min-w-52 text-sm text-zinc-400 whitespace-nowrap flex items-center justify-center">
                      {formatDate(alert.created_at)}
                    </td>
                    <td className="p-5 col-span-4 min-w-52 text-sm text-zinc-400 whitespace-nowrap flex items-center justify-center">
                      {alert.fixed_at ||
                      alert.dismissed_at ||
                      alert.state === "auto_dismissed" ? (
                        formatDate(
                          alert.fixed_at ||
                            alert.dismissed_at ||
                            alert.auto_dismissed,
                        )
                      ) : (
                        <span className="text-zinc-600 text-xs italic">
                          Aún abierta
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedAlert && (
          <div
            className="fixed inset-0 z-50 overflow-y-auto flex justify-center sm:py-8 md:py-18 bg-black/90"
            onClick={() => setSelectedAlert(null)}
          >
            <div
              className="bg-zinc-900 border border-zinc-700 rounded-2xl max-w-3xl w-full h-fit overflow-hidden flex flex-col shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-zinc-800 flex justify-between items-start bg-zinc-900/50">
                <div className="w-full">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm text-indigo-400">
                        {selectedAlert.repository}
                      </span>
                      <span className="text-zinc-600">•</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getSeverityColor(selectedAlert.security_vulnerability.severity)}`}
                      >
                        {selectedAlert.security_vulnerability.severity}
                      </span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-medium border capitalize ${getStateColor(selectedAlert.state)}`}
                    >
                      {selectedAlert.state}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold font-mono text-zinc-100">
                    {selectedAlert.security_vulnerability.package.name}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedAlert(null)}
                  className="text-zinc-400 hover:text-white p-2 rounded-lg hover:bg-zinc-800 transition-colors ml-4"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
                  {/* Nombre del Paquete y GHSA ID */}
                  <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 col-span-2 md:col-span-2">
                    <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">
                      Nombre del Paquete
                    </p>
                    <p className="font-mono text-sm font-semibold text-zinc-100">
                      {selectedAlert.security_vulnerability.package.name}
                    </p>
                  </div>
                  <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 md:col-span-2">
                    <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">
                      Ecosistema
                    </p>
                    <p className="font-mono text-sm uppercase text-indigo-300 font-bold">
                      {selectedAlert.security_vulnerability.package.ecosystem}
                    </p>
                  </div>
                  <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 md:col-span-2">
                    <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1 relative">
                      <CopyToClipboardButton
                        text={String(selectedAlert.security_advisory.ghsa_id)}
                      />
                      GHSA ID
                    </div>
                    <p className="font-mono text-sm">
                      {selectedAlert.security_advisory.ghsa_id}
                    </p>
                  </div>

                  {/* Filas de Fechas Detallada */}
                  <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 col-span-2 md:col-span-3">
                    <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">
                      Creada
                    </p>
                    <p className="font-mono text-sm text-red-300">
                      {formatDate(selectedAlert.created_at)}
                    </p>
                  </div>
                  <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 col-span-2 md:col-span-3">
                    <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">
                      Arreglada
                    </p>
                    {selectedAlert.fixed_at ? (
                      <p className="font-mono text-sm text-green-300">
                        {formatDate(selectedAlert.fixed_at)}
                      </p>
                    ) : (
                      <p className="font-mono text-xs italic text-zinc-600">
                        Aún abierta - No se ha detectado parche oficial aplicado
                      </p>
                    )}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-sm text-zinc-500 uppercase tracking-wider mb-3 font-semibold border-b border-zinc-800 pb-2">
                    Resumen de la Vulnerabilidad
                  </h3>
                  <p className="text-zinc-100 text-sm leading-relaxed bg-zinc-950 p-5 rounded-xl border border-zinc-800">
                    {selectedAlert.security_advisory.summary}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm text-zinc-500 uppercase tracking-wider mb-3 font-semibold border-b border-zinc-800 pb-2">
                    Descripción Detallada
                  </h3>
                  <div className="bg-zinc-950 p-5 rounded-xl border border-zinc-800 prose prose-invert prose-sm max-w-none text-zinc-300 custom-scrollbar">
                    <pre className="whitespace-pre-wrap font-sans text-sm">
                      {selectedAlert.security_advisory.description}
                    </pre>
                  </div>
                </div>
              </div>

              <div className="p-5 border-t border-zinc-800 bg-zinc-950 flex justify-end gap-3">
                <button
                  onClick={() => setSelectedAlert(null)}
                  className="text-zinc-400 hover:text-white text-sm px-6 py-2 transition-colors cursor-pointer"
                >
                  Cerrar
                </button>
                <a
                  href={selectedAlert.html_url}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
                >
                  Ver Alerta Completa en GitHub ↗
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
