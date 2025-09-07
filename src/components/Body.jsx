function Body() {
  return (
    <main style={{ minHeight: "70vh", padding: "2rem", textAlign: "center" }}>
      <h2>Bievenidos a nuestra pagina "Donde esta la mano"</h2>
      <p>En esta primera fase logramos:

Subir el proyecto React (Capstone) a un repositorio en GitHub.
Configurar un flujo de Integración Continua (CI/CD) con Azure Static Web Apps, de manera que cada cambio en la rama principal (main) dispara automáticamente:
La construcción del proyecto (npm run build).
El despliegue en Azure con HTTPS y CDN habilitados.
Implementar un archivo de configuración (staticwebapp.config.json) que asegura la correcta navegación entre páginas de la aplicación (rutas SPA).

✅ Con esto, el proyecto ya cuenta con una URL pública accesible desde cualquier navegador, y un flujo automatizado de publicación cada vez que se suben cambios al repositorio.</p>
    </main>
  );
}

export default Body;
