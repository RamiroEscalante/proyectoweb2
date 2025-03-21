import { Component } from '@angular/core';
import { InventarioService } from '../../services/inventario.service';
import { Producto } from '../../models/producto';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inventario.component.html',
  styleUrl: './inventario.component.css'
})
export class InventarioComponent {
  productos$: Observable<Producto[]>; // Observables para productos

  nuevoProducto: Producto = { id: 0, nombre: '', precio: 0, imagen: '' };

  constructor(public inventarioService: InventarioService, private router: Router) {
    this.productos$ = this.inventarioService.productos$; // Asignación dentro del constructor
  }

  agregarProducto() {
    if (!this.nuevoProducto.nombre || this.nuevoProducto.precio <= 0) {
      alert("Por favor, ingrese un nombre y un precio válido.");
      return;
    }

    // Verificar si la ID ya existe en la lista de productos
    this.productos$.subscribe(productos => {
      if (productos.some(producto => producto.id === this.nuevoProducto.id)) {
        alert("La ID del producto ya existe. Por favor, elija otra.");
        return;
      } else {
        const nuevoProducto: Producto = {
          id: this.nuevoProducto.id,
          nombre: this.nuevoProducto.nombre,
          precio: this.nuevoProducto.precio,
          imagen: this.nuevoProducto.imagen || `asset/noimagen.jpg`, // Imagen por defecto  
        };

        this.inventarioService.agregarProducto(nuevoProducto);

        // Reiniciar formulario
        this.nuevoProducto = { id: 0, nombre: '', precio: 0, imagen: '' };
      }
    });
  }

  eliminarProducto(id: number) {
    this.inventarioService.eliminarProducto(id);
  }

  descargarXML() {
    this.inventarioService.generarXML();
  }

  irAProducto() {
    this.router.navigate(['']);
  }
}