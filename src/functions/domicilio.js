import { supabase } from '../db/supabase.js';

/**
 * Crear un nuevo pedido a domicilio
 * @param {Object} pedidoData - Datos del pedido
 * @returns {Promise<Object|null>} Pedido creado o null si error
 */
export async function createPedidoDomicilio(pedidoData) {
    try {
        console.log('🏠 Creando pedido a domicilio...', pedidoData);

        const insertData = {
            nombre: pedidoData.nombre,
            telefono: pedidoData.telefono,
            direccion: pedidoData.direccion,
            productos: pedidoData.productos,
            total: pedidoData.total,
            is_paid: pedidoData.is_paid || false,
            payment_method: pedidoData.payment_method || 'efectivo'
        };

        // Solo agregar campos opcionales si existen
        if (pedidoData.apellidos) insertData.apellidos = pedidoData.apellidos;
        if (pedidoData.dni) insertData.dni = pedidoData.dni;
        if (pedidoData.stripe_payment_id) insertData.stripe_payment_id = pedidoData.stripe_payment_id;

        const { data, error } = await supabase
            .from('pedidos_domicilio')
            .insert(insertData)
            .select()
            .single();

        if (error) {
            console.error('❌ Error creando pedido a domicilio:', error);
            return { success: false, error: error.message };
        }

        console.log('✅ Pedido a domicilio creado:', data.id);

        // Update product stock for each item
        if (pedidoData.productos && pedidoData.productos.length > 0) {
            console.log('📦 Actualizando stock de productos...');
            for (const producto of pedidoData.productos) {
                try {
                    console.log(`📦 Actualizando stock del producto ${producto.id}, cantidad: ${producto.cantidad}`);
                    
                    // First get current stock
                    const { data: currentProduct, error: getError } = await supabase
                        .from('products')
                        .select('stock')
                        .eq('product_id', producto.id)
                        .single();
                    
                    if (getError) {
                        console.warn('⚠️ Warning: Could not get current stock for product', producto.id, getError);
                        continue;
                    }
                    
                    // Calculate new stock (never below 0)
                    const newStock = Math.max(0, (currentProduct.stock || 0) - producto.cantidad);
                    
                    // Update stock
                    const { error: stockError } = await supabase
                        .from('products')
                        .update({ stock: newStock })
                        .eq('product_id', producto.id);
                    
                    if (stockError) {
                        console.warn('⚠️ Warning: Could not update stock for product', producto.id, stockError);
                        // Don't fail the order creation if stock update fails
                    } else {
                        console.log(`✅ Stock actualizado para producto ${producto.id}: ${currentProduct.stock} → ${newStock}`);
                    }
                } catch (stockUpdateError) {
                    console.warn('⚠️ Warning updating stock:', stockUpdateError);
                    // Continue with next product
                }
            }
        }

        return { success: true, data: data };
    } catch (error) {
        console.error('❌ Error en createPedidoDomicilio:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Obtener todos los pedidos a domicilio
 * @returns {Promise<Array>} Array de pedidos
 */
export async function getPedidosDomicilio() {
    try {
        const { data, error } = await supabase
            .from('pedidos_domicilio')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('❌ Error obteniendo pedidos a domicilio:', error);
            return [];
        }

        return data || [];
    } catch (error) {
        console.error('❌ Error en getPedidosDomicilio:', error);
        return [];
    }
}

/**
 * Obtener pedido a domicilio por ID
 * @param {number} id - ID del pedido
 * @returns {Promise<Object|null>} Pedido o null si no encontrado
 */
export async function getPedidoDomicilioById(id) {
    try {
        const { data, error } = await supabase
            .from('pedidos_domicilio')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('❌ Error obteniendo pedido a domicilio por ID:', error);
            return null;
        }

        return data;
    } catch (error) {
        console.error('❌ Error en getPedidoDomicilioById:', error);
        return null;
    }
}

/**
 * Actualizar estado de pago de un pedido a domicilio
 * @param {number} id - ID del pedido
 * @param {boolean} isPaid - Estado de pago
 * @returns {Promise<Object|null>} Pedido actualizado o null si error
 */
export async function updatePagoPedidoDomicilio(id, isPaid) {
    try {
        console.log(`💳 Actualizando pago del pedido ${id} a ${isPaid ? 'pagado' : 'pendiente'}`);

        const { data, error } = await supabase
            .from('pedidos_domicilio')
            .update({ is_paid: isPaid })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('❌ Error actualizando pago del pedido:', error);
            return null;
        }

        console.log('✅ Pago del pedido actualizado');
        return data;
    } catch (error) {
        console.error('❌ Error en updatePagoPedidoDomicilio:', error);
        return null;
    }
}

/**
 * Eliminar un pedido a domicilio
 * @param {number} id - ID del pedido
 * @returns {Promise<boolean>} True si exitoso, false si error
 */
export async function deletePedidoDomicilio(id) {
    try {
        const { error } = await supabase
            .from('pedidos_domicilio')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('❌ Error eliminando pedido a domicilio:', error);
            return false;
        }

        console.log('✅ Pedido a domicilio eliminado');
        return true;
    } catch (error) {
        console.error('❌ Error en deletePedidoDomicilio:', error);
        return false;
    }
}

/**
 * Obtener pedidos a domicilio por estado de pago
 * @param {boolean} isPaid - Estado de pago
 * @returns {Promise<Array>} Array de pedidos filtrados
 */
export async function getPedidosDomicilioByPago(isPaid) {
    try {
        const { data, error } = await supabase
            .from('pedidos_domicilio')
            .select('*')
            .eq('is_paid', isPaid)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('❌ Error obteniendo pedidos por estado de pago:', error);
            return [];
        }

        return data || [];
    } catch (error) {
        console.error('❌ Error en getPedidosDomicilioByPago:', error);
        return [];
    }
}

/**
 * Obtener estadísticas de pedidos a domicilio
 * @returns {Promise<Object>} Estadísticas
 */
export async function getEstadisticasDomicilio() {
    try {
        const { data, error } = await supabase
            .from('pedidos_domicilio')
            .select('is_paid, total, created_at');

        if (error) {
            console.error('❌ Error obteniendo estadísticas:', error);
            return {
                total_pedidos: 0,
                pedidos_pagados: 0,
                pedidos_pendientes: 0,
                total_ingresos: 0
            };
        }

        const stats = {
            total_pedidos: data.length,
            pedidos_pagados: data.filter(p => p.is_paid).length,
            pedidos_pendientes: data.filter(p => !p.is_paid).length,
            total_ingresos: data.filter(p => p.is_paid).reduce((sum, p) => sum + parseFloat(p.total || 0), 0)
        };

        return stats;
    } catch (error) {
        console.error('❌ Error en getEstadisticasDomicilio:', error);
        return {
            total_pedidos: 0,
            pedidos_pagados: 0,
            pedidos_pendientes: 0,
            total_ingresos: 0
        };
    }
}