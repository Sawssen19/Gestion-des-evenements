import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  id: string;
  email: string;
  roles: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    // Simuler un utilisateur connecté pour le développement
    this.currentUserSubject.next({
      id: '1',
      email: 'admin@example.com',
      roles: ['ADMIN']
    });
  }

  isAdmin(): boolean {
    const currentUser = this.currentUserSubject.value;
    return currentUser?.roles?.includes('ADMIN') || false;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string): Observable<User> {
    // Simulation d'une connexion réussie
    const user: User = {
      id: '1',
      email: email,
      roles: ['ADMIN']
    };
    this.currentUserSubject.next(user);
    return new Observable(observer => {
      observer.next(user);
      observer.complete();
    });
  }

  logout(): void {
    this.currentUserSubject.next(null);
  }
}
