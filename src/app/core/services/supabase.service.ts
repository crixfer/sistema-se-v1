import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;
  private isConnected = false;
  private connectionTested = false;

  constructor() {
    // Configuración que evita problemas de LockManager
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey,
      {
        auth: {
          // Deshabilitar persistencia para evitar LockManager
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
          storage: undefined, // No usar localStorage
          storageKey: undefined,
          flowType: 'implicit'
        },
        db: {
          schema: 'public'
        },
        global: {
          headers: {
            'x-my-custom-header': 'angular-admin-system'
          }
        },
        // Configuración adicional para evitar problemas
        realtime: {
          params: {
            eventsPerSecond: 2
          }
        }
      }
    );

    // No inicializar auth automáticamente para evitar errores
    this.testConnectionSilently();
  }

  get client() {
    return this.supabase;
  }

  // Método para obtener el cliente de Supabase
  getClient() {
    return this.supabase;
  }

  // Método para verificar la conexión de forma silenciosa
  private async testConnectionSilently(): Promise<void> {
    try {
      // Test simple sin autenticación
      const response = await fetch(`${environment.supabaseUrl}/rest/v1/`, {
        method: 'HEAD',
        headers: {
          'apikey': environment.supabaseKey,
          'Authorization': `Bearer ${environment.supabaseKey}`
        }
      });
      
      this.isConnected = response.ok;
      this.connectionTested = true;
      
      if (!this.isConnected) {
        console.warn('Supabase connection test failed, using offline mode');
      }
    } catch (error) {
      console.warn('Supabase connection test error, using offline mode:', error);
      this.isConnected = false;
      this.connectionTested = true;
    }
  }

  // Método para verificar la conexión
  async testConnection(): Promise<boolean> {
    if (!this.connectionTested) {
      await this.testConnectionSilently();
    }
    return this.isConnected;
  }

  // Método seguro para hacer consultas
  async safeQuery(tableName: string, query: any): Promise<{ data: any[] | null, error: any }> {
    try {
      if (!await this.testConnection()) {
        return { data: null, error: { message: 'No connection to Supabase' } };
      }

      const result = await query;
      return result;
    } catch (error: any) {
      console.error(`Error in safe query for ${tableName}:`, error);
      
      // Detectar errores específicos de LockManager o red
      if (error.message?.includes('LockManager') || 
          error.message?.includes('Failed to fetch') ||
          error.message?.includes('NetworkError')) {
        this.isConnected = false;
      }
      
      return { data: null, error };
    }
  }

  // Método para reinicializar la conexión si es necesario
  reinitializeClient(): void {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
          storage: undefined,
          storageKey: undefined,
          flowType: 'implicit'
        }
      }
    );
    this.connectionTested = false;
    this.isConnected = false;
  }

  // Método para verificar si está conectado
  isSupabaseConnected(): boolean {
    return this.isConnected;
  }
}