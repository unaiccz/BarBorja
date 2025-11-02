# 🔧 Modificaciones necesarias en index.astro (Formulario de Productos)

## 📝 Cambio 1: Agregar campo de categoría en el formulario HTML

Busca en `src/pages/admin/index.astro` la sección del formulario de productos (alrededor de la línea 60-100).

Localiza esta sección:
```html
<div class="form-group">
    <label for="type">Tipo:</label>
    <select id="type" name="type" required>
        <option value="">Seleccionar tipo</option>
        <option value="cocina">Cocina</option>
        <option value="barra">Barra</option>
    </select>
</div>
```

**REEMPLAZA POR:**
```html
<div class="form-group">
    <label for="type">Tipo:</label>
    <select id="type" name="type" required>
        <option value="">Seleccionar tipo</option>
        <option value="cocina">Cocina</option>
        <option value="barra">Barra</option>
    </select>
</div>
<div class="form-group">
    <label for="category_id">Categoría:</label>
    <select id="category_id" name="category_id">
        <option value="">Seleccionar categoría</option>
        <!-- Las categorías se cargarán dinámicamente -->
    </select>
</div>
```

---

## 🔄 Cambio 2: Cargar categorías dinámicamente en el formulario

En la función `fillProductForm()`, localiza esta sección (alrededor de línea 2100):

```javascript
function fillProductForm(product) {
    const nameInput = document.getElementById('name');
    const descriptionInput = document.getElementById('description');
    const priceInput = document.getElementById('price');
    const stockInput = document.getElementById('stock');
    const typeInput = document.getElementById('type');
    const ingredientsInput = document.getElementById('ingredients');
    const allergensInput = document.getElementById('allergens');
    const currentImageUrl = document.getElementById('current_image_url');
    // ... resto del código
}
```

**REEMPLAZA POR:**
```javascript
function fillProductForm(product) {
    const nameInput = document.getElementById('name');
    const descriptionInput = document.getElementById('description');
    const priceInput = document.getElementById('price');
    const stockInput = document.getElementById('stock');
    const typeInput = document.getElementById('type');
    const ingredientsInput = document.getElementById('ingredients');
    const allergensInput = document.getElementById('allergens');
    const categoryInput = document.getElementById('category_id');
    const currentImageUrl = document.getElementById('current_image_url');
    const imagePreview = document.getElementById('image_preview');
    const previewImg = document.getElementById('preview_img');

    if (nameInput) nameInput.value = product.name || '';
    if (descriptionInput) descriptionInput.value = product.description || '';
    if (priceInput) priceInput.value = product.price || '';
    if (stockInput) stockInput.value = product.stock || '';
    if (typeInput) typeInput.value = product.type || '';
    if (ingredientsInput) ingredientsInput.value = product.ingredients || '';
    if (allergensInput) allergensInput.value = product.allergens || '';
    if (categoryInput) categoryInput.value = product.category_id || '';
    
    // Manejar imagen actual
    if (currentImageUrl) currentImageUrl.value = product.image_url || '';
    if (product.image_url && imagePreview && previewImg) {
        previewImg.src = product.image_url;
        imagePreview.style.display = 'block';
    }
}
```

---

## 💾 Cambio 3: Guardar la categoría en el producto

En la función `handleProductSubmit()`, busca donde se crea `productData`:

```javascript
const productData = {
    name: formData.get('name')?.toString() || '',
    description: formData.get('description')?.toString() || '',
    price: parseFloat(formData.get('price')?.toString() || '0'),
    stock: parseInt(formData.get('stock')?.toString() || '0'),
    type: formData.get('type')?.toString() || '',
    ingredients: formData.get('ingredients')?.toString() || '',
    allergens: formData.get('allergens')?.toString() || '',
    image_url: imageUrl
};
```

**REEMPLAZA POR:**
```javascript
const productData = {
    name: formData.get('name')?.toString() || '',
    description: formData.get('description')?.toString() || '',
    price: parseFloat(formData.get('price')?.toString() || '0'),
    stock: parseInt(formData.get('stock')?.toString() || '0'),
    type: formData.get('type')?.toString() || '',
    ingredients: formData.get('ingredients')?.toString() || '',
    allergens: formData.get('allergens')?.toString() || '',
    image_url: imageUrl,
    category_id: formData.get('category_id')?.toString() || null
};
```

---

## 📂 Cambio 4: Cargar categorías en el select (nuevo código)

Agrega esta función al JavaScript (después de la función `initializeCategoryForm()`):

```javascript
async function loadCategoriesSelect() {
    try {
        const { supabase } = await import('/src/lib/supabase.js');
        
        const { data: categoriesData, error } = await supabase
            .from('categories')
            .select('id, name, icon')
            .order('order', { ascending: true });

        if (error) {
            console.error('Error loading categories:', error);
            return;
        }

        const categorySelect = document.getElementById('category_id');
        if (!categorySelect) return;

        // Limpiar opciones existentes (excepto la primera)
        while (categorySelect.options.length > 1) {
            categorySelect.remove(1);
        }

        // Agregar categorías
        if (categoriesData && categoriesData.length > 0) {
            categoriesData.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat.id;
                option.textContent = `${cat.icon} ${cat.name}`;
                categorySelect.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}
```

---

## 🚀 Cambio 5: Llamar a la función al inicializar

En el `DOMContentLoaded`, agrega:

```javascript
document.addEventListener('DOMContentLoaded', async function() {
    // ... código existente ...

    // Initialize category form
    initializeCategoryForm();
    
    // Cargar categorías en el select
    await loadCategoriesSelect();

    // Load initial data
    await Promise.all([loadProducts(), loadOrders(), loadCategories()]);

    // ... resto del código ...
});
```

---

## 🔍 Cambio 6: Actualizar renderizado de productos (mostrar categoría)

En la función `renderProducts()`, si quieres mostrar la categoría del producto en la tarjeta, busca donde se renderiza cada producto y agrega la categoría.

Esto dependerá de cómo esté estructurado actualmente tu código de renderizado.

---

## 📋 RESUMEN DE CAMBIOS

| Cambio | Ubicación | Acción |
|--------|-----------|--------|
| 1 | Formulario HTML | Agregar `<select>` para categoría |
| 2 | `fillProductForm()` | Agregar lectura de `category_id` |
| 3 | `handleProductSubmit()` | Guardar `category_id` en productData |
| 4 | JavaScript | Nueva función `loadCategoriesSelect()` |
| 5 | `DOMContentLoaded` | Llamar `loadCategoriesSelect()` |
| 6 | `renderProducts()` | (Opcional) Mostrar categoría en tarjeta |

---

## ✅ VERIFICACIÓN

Después de hacer los cambios:

1. Recarga la página del admin
2. Haz clic en "Nuevo Producto"
3. Deberías ver un nuevo campo "Categoría" con las opciones de la base de datos
4. Selecciona una categoría y guarda
5. Verifica en la base de datos que se guardó el `category_id`

---

## 🎯 PRÓXIMOS PASOS

Después de esto, puedes:
- ✅ Filtrar productos por categoría
- ✅ Mostrar categorías en la visualización de menu
- ✅ Organizar productos por secciones
