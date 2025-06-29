export default function PlatformGuidePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Platform Guide
        </h1>
        
        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Overview
            </h2>
            <p className="text-gray-600 mb-4">
              This guide provides comprehensive information about our platform.
            </p>
          </section>
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Getting Started
            </h2>
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
              <p className="text-blue-700">
                Follow these steps to get started with the platform.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
