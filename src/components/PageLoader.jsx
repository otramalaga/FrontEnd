export default function PageLoader() {
  return (
    <div className="flex min-h-[50vh] w-full items-center justify-center bg-base-100">
      <span className="loading loading-spinner loading-lg text-primary" aria-label="Cargando" />
    </div>
  );
}
