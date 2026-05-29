import React from 'react';
import styles from './Table.module.css';

export default function Table({ columns, data, onEdit, onDelete, loading }) {
  if (loading) return <p style={{ padding: 24, color: '#888' }}>Carregando...</p>;
  if (!data.length) return <p style={{ padding: 24, color: '#888' }}>Nenhum registro encontrado.</p>;

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>{columns.map(c => <th key={c.key}>{c.label}</th>)}</tr>
        </thead>
        <tbody>
          {data.map(row => (
            <tr key={row.id}>
              {columns.map(c => (
                <td key={c.key}>{c.render ? c.render(row) : row[c.key]}</td>
              ))}
              {(onEdit || onDelete) && (
                <td>
                  {onEdit   && <button className={styles.btnEdit}   onClick={() => onEdit(row)}>Editar</button>}
                  {onDelete && <button className={styles.btnDelete} onClick={() => onDelete(row)}>Excluir</button>}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
