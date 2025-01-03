import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { Blog, Comment } from '../models/blog.model';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private readonly STORAGE_KEY = 'blogs';
  private blogsSubject = new BehaviorSubject<Blog[]>([]);
  blogs$ = this.blogsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    const storedBlogs = localStorage.getItem(this.STORAGE_KEY);
    if (storedBlogs) {
      this.blogsSubject.next(JSON.parse(storedBlogs));
    } else {
      this.initializeDefaultBlogs();
    }
  }

  private initializeDefaultBlogs() {
    const defaultBlogs: Blog[] = [
      {
        id: '1',
        title: 'Introduction à Angular',
        content: `# Angular: Le framework moderne pour le web
        
Angular est un framework complet pour créer des applications web modernes. Il offre tout ce dont vous avez besoin pour construire des applications robustes et évolutives.

## Principales caractéristiques

1. **Architecture MVC**
   - Séparation claire des responsabilités
   - Code plus maintenable
   - Meilleure organisation du projet

2. **TypeScript**
   - Typage statique
   - Détection d'erreurs précoce
   - Meilleure expérience de développement

3. **Composants**
   - Réutilisables
   - Encapsulés
   - Faciles à tester

## Exemple de code

\`\`\`typescript
@Component({
  selector: 'app-hello',
  template: '<h1>{{ message }}</h1>'
})
export class HelloComponent {
  message = 'Hello Angular!';
}
\`\`\`

## Conclusion

Angular est un excellent choix pour les applications web modernes. Sa structure robuste et ses fonctionnalités avancées en font un outil puissant pour les développeurs.`,
        author: 'Sarah Johnson',
        authorAvatar: 'assets/images/avatars/sarah.jpg',
        imageUrl: 'assets/images/blog/angular-intro.jpg',
        createdAt: new Date(2024, 0, 1).toISOString(),
        likes: 42,
        views: 156,
        isLiked: false,
        isFavorite: false,
        comments: [],
        tags: ['Angular', 'Web', 'TypeScript']
      },
      {
        id: '2',
        title: 'Les meilleures pratiques TypeScript',
        content: `# TypeScript: Écrire du JavaScript moderne

TypeScript apporte la sécurité des types à JavaScript, rendant votre code plus robuste et plus facile à maintenir.

## Pourquoi TypeScript?

1. **Typage statique**
   - Détection d'erreurs à la compilation
   - Meilleure documentation du code
   - Autocomplétion plus précise

2. **Fonctionnalités modernes**
   - Classes et interfaces
   - Génériques
   - Décorateurs

## Bonnes pratiques

1. Toujours définir des types explicites
2. Utiliser des interfaces pour les objets
3. Éviter le type \`any\`

## Exemple

\`\`\`typescript
interface User {
  id: string;
  name: string;
  email: string;
}

class UserService {
  private users: User[] = [];

  addUser(user: User): void {
    this.users.push(user);
  }

  getUser(id: string): User | undefined {
    return this.users.find(u => u.id === id);
  }
}
\`\`\`

## Conclusion

TypeScript est un excellent outil pour écrire du code JavaScript plus sûr et plus maintenable.`,
        author: 'Michel Dubois',
        authorAvatar: 'assets/images/avatars/michel.jpg',
        imageUrl: 'assets/images/blog/typescript.jpg',
        createdAt: new Date(2024, 0, 2).toISOString(),
        likes: 28,
        views: 94,
        isLiked: false,
        isFavorite: false,
        comments: [],
        tags: ['TypeScript', 'JavaScript', 'Développement']
      },
      {
        id: '3',
        title: 'RxJS et la programmation réactive',
        content: `# RxJS: Gérer les flux de données asynchrones

RxJS est une bibliothèque pour la programmation réactive en JavaScript. Elle permet de gérer facilement les flux de données asynchrones.

## Concepts clés

1. **Observable**
   - Flux de données
   - Peut émettre plusieurs valeurs
   - Peut être annulé

2. **Opérateurs**
   - map
   - filter
   - merge
   - switchMap

## Exemple pratique

\`\`\`typescript
import { fromEvent } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';

const searchInput = document.querySelector('input');
const searchResults$ = fromEvent(searchInput, 'input').pipe(
  debounceTime(300),
  map(event => event.target.value)
);

searchResults$.subscribe(value => {
  console.log('Recherche:', value);
});
\`\`\`

## Avantages

1. Gestion élégante de l'asynchrone
2. Composition facile des opérations
3. Gestion des erreurs intégrée

## Conclusion

RxJS est un outil puissant pour gérer la complexité des applications modernes.`,
        author: 'Emma Wilson',
        authorAvatar: 'assets/images/avatars/emma.jpg',
        imageUrl: 'assets/images/blog/rxjs.jpg',
        createdAt: new Date(2024, 0, 3).toISOString(),
        likes: 35,
        views: 128,
        isLiked: false,
        isFavorite: false,
        comments: [],
        tags: ['RxJS', 'Angular', 'JavaScript']
      }
    ];

    this.storeBlogs(defaultBlogs);
  }

  private getStoredBlogs(): Blog[] {
    const storedBlogs = localStorage.getItem(this.STORAGE_KEY);
    return storedBlogs ? JSON.parse(storedBlogs) : [];
  }

  private storeBlogs(blogs: Blog[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(blogs));
    this.blogsSubject.next(blogs);
  }

  getBlogs(): Observable<Blog[]> {
    return this.blogs$;
  }

  getBlogById(id: string): Observable<Blog | undefined> {
    return of(this.blogsSubject.value.find(blog => blog.id === id));
  }

  createBlog(blog: Partial<Blog>): Observable<Blog> {
    const blogs = this.getStoredBlogs();
    const newBlog: Blog = {
      id: crypto.randomUUID(),
      title: blog.title || '',
      content: blog.content || '',
      author: blog.author || 'Anonymous',
      authorAvatar: blog.authorAvatar,
      imageUrl: blog.imageUrl,
      createdAt: new Date().toISOString(),
      likes: 0,
      views: 0,
      isLiked: false,
      isFavorite: false,
      comments: [],
      tags: blog.tags || []
    };

    blogs.unshift(newBlog);
    this.storeBlogs(blogs);
    return of(newBlog);
  }

  updateBlog(updatedBlog: Blog): Observable<Blog> {
    const blogs = this.getStoredBlogs();
    const index = blogs.findIndex(blog => blog.id === updatedBlog.id);
    
    if (index === -1) {
      throw new Error('Blog not found');
    }

    blogs[index] = {
      ...updatedBlog,
      updatedAt: new Date().toISOString()
    };
    
    this.storeBlogs(blogs);
    return of(blogs[index]);
  }

  deleteBlog(id: string): Observable<void> {
    const blogs = this.blogsSubject.value;
    const updatedBlogs = blogs.filter(blog => blog.id !== id);
    this.storeBlogs(updatedBlogs);
    return of(void 0);
  }

  addComment(blogId: string, comment: Partial<Comment>): Observable<Blog> {
    const blogs = this.getStoredBlogs();
    const blogIndex = blogs.findIndex(blog => blog.id === blogId);
    
    if (blogIndex === -1) {
      throw new Error('Blog not found');
    }

    const newComment: Comment = {
      id: crypto.randomUUID(),
      content: comment.content || '',
      author: comment.author || 'Anonymous',
      authorAvatar: comment.authorAvatar,
      createdAt: new Date().toISOString(),
      likes: 0,
      isLiked: false
    };

    blogs[blogIndex] = {
      ...blogs[blogIndex],
      comments: [...(blogs[blogIndex].comments || []), newComment]
    };

    this.storeBlogs(blogs);
    return of(blogs[blogIndex]);
  }

  updateComment(blogId: string, commentId: string, updatedContent: string): Observable<Blog> {
    const blogs = this.getStoredBlogs();
    const blogIndex = blogs.findIndex(blog => blog.id === blogId);
    
    if (blogIndex === -1) {
      throw new Error('Blog not found');
    }

    const commentIndex = blogs[blogIndex].comments.findIndex(
      comment => comment.id === commentId
    );
    
    if (commentIndex === -1) {
      throw new Error('Comment not found');
    }

    const updatedComment = {
      ...blogs[blogIndex].comments[commentIndex],
      content: updatedContent,
      updatedAt: new Date().toISOString()
    };

    const updatedComments = [...blogs[blogIndex].comments];
    updatedComments[commentIndex] = updatedComment;

    blogs[blogIndex] = {
      ...blogs[blogIndex],
      comments: updatedComments
    };

    this.storeBlogs(blogs);
    return of(blogs[blogIndex]);
  }

  deleteComment(blogId: string, commentId: string): Observable<Blog> {
    const blogs = this.getStoredBlogs();
    const blogIndex = blogs.findIndex(blog => blog.id === blogId);
    
    if (blogIndex === -1) {
      throw new Error('Blog not found');
    }

    blogs[blogIndex] = {
      ...blogs[blogIndex],
      comments: blogs[blogIndex].comments.filter(
        comment => comment.id !== commentId
      )
    };

    this.storeBlogs(blogs);
    return of(blogs[blogIndex]);
  }

  toggleLike(blogId: string): Observable<Blog> {
    const blogs = this.getStoredBlogs();
    const blogIndex = blogs.findIndex(blog => blog.id === blogId);
    
    if (blogIndex === -1) {
      throw new Error('Blog not found');
    }

    const blog = blogs[blogIndex];
    blogs[blogIndex] = {
      ...blog,
      isLiked: !blog.isLiked,
      likes: blog.isLiked ? blog.likes - 1 : blog.likes + 1
    };

    this.storeBlogs(blogs);
    return of(blogs[blogIndex]);
  }
}
