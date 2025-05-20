
import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gray-50">
          <div className="text-center max-w-md">
            <div className="text-6xl font-bold text-red-500 mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Oups, quelque chose s'est mal passé
            </h1>
            <p className="text-gray-600 mb-6">
              Nous avons rencontré une erreur inattendue. Veuillez réessayer ou retourner à la page d'accueil.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                variant="outline" 
                onClick={() => window.location.reload()}
              >
                Actualiser la page
              </Button>
              <Link to="/">
                <Button>
                  Retour à l'accueil
                </Button>
              </Link>
            </div>
            {this.state.error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md text-left">
                <p className="text-sm font-medium text-red-800 mb-2">Détails de l'erreur (pour le support technique) :</p>
                <pre className="text-xs overflow-auto p-2 bg-red-100 rounded">
                  {this.state.error.toString()}
                </pre>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
