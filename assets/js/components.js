/** VMP UI Components */
const UI = {
  badge(status) {
    return `<span class="badge ${VMP.badgeClass(status)}">${status}</span>`;
  },

  stepper(steps, currentIndex, options = {}) {
    const { interactive = true, flowId } = options;
    const attrs = interactive && flowId ? ` class="stepper stepper-interactive" data-flow="${flowId}"` : ' class="stepper"';
    return `<div${attrs}>${steps.map((s, i) => {
      const cls = i < currentIndex ? 'done' : i === currentIndex ? 'current' : 'pending';
      const clickAttrs = interactive ? ` data-step="${i}" role="button" tabindex="0"` : '';
      return `<div class="step ${cls}"${clickAttrs}><div class="step-circle">${i < currentIndex ? '✓' : i + 1}</div><div class="step-label">${s}</div></div>`;
    }).join('')}</div>`;
  },

  processFlow(steps, currentIndex, options = {}) {
    const { note, panels } = options;
    const flowId = 'flow-' + Math.random().toString(36).slice(2, 8);
    const stepper = UI.stepper(steps, currentIndex, { interactive: true, flowId });
    const panelBlock = panels ? `<div class="process-flow-panels" data-flow="${flowId}">${panels.map((p, i) =>
      `<div class="process-flow-panel ${i === currentIndex ? 'active' : ''}" data-panel="${i}">${p}</div>`
    ).join('')}</div>` : '';
    return stepper + (note ? UI.alert('info', note) : '') + panelBlock;
  },

  statsGrid(cards) {
    return `<div class="stats-grid">${cards.map(c =>
      `<div class="stat-card ${c.class || ''}" ${c.nav ? `data-nav="${c.nav}"` : ''}>
        <div class="stat-value">${c.value}</div>
        <div class="stat-label">${c.label}</div>
        ${c.change ? `<div class="stat-change">${c.change}</div>` : ''}
      </div>`
    ).join('')}</div>`;
  },

  card(title, body, actions = '') {
    return `<div class="card"><div class="card-header"><h3>${title}</h3>${actions}</div><div class="card-body">${body}</div></div>`;
  },

  table(headers, rows, emptyMsg = 'No records found') {
    if (!rows.length) return `<div class="empty-state">${emptyMsg}</div>`;
    return `<div class="table-wrap"><table><thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.join('')}</tbody></table></div>`;
  },

  toolbar(items) {
    return `<div class="toolbar">${items.join('')}</div>`;
  },

  formGrid(fields) {
    return `<div class="form-grid">${fields.map(f =>
      `<div class="form-group ${f.full ? 'full' : ''}">
        <label>${f.label}</label>
        ${f.type === 'select' ? `<select ${f.disabled ? 'disabled' : ''}>${(f.options || []).map(o => `<option ${o.selected ? 'selected' : ''}>${o.label || o}</option>`).join('')}</select>` :
          f.type === 'textarea' ? `<textarea rows="${f.rows || 3}" ${f.disabled ? 'disabled' : ''}>${f.value || ''}</textarea>` :
          `<input type="${f.type || 'text'}" value="${f.value || ''}" ${f.disabled ? 'disabled' : ''} placeholder="${f.placeholder || ''}">`}
      </div>`
    ).join('')}</div>`;
  },

  detailRows(items) {
    return items.map(i => `<div class="detail-row"><div class="label">${i.label}</div><div class="value">${i.value}</div></div>`).join('');
  },

  tabs(tabDefs, activeIndex = 0) {
    const id = 'tab-' + Math.random().toString(36).slice(2, 8);
    return `<div class="tabs-container" data-tabs="${id}">
      <div class="tabs">${tabDefs.map((t, i) => `<div class="tab ${i === activeIndex ? 'active' : ''}" data-tab="${i}">${t.label}</div>`).join('')}</div>
      ${tabDefs.map((t, i) => `<div class="tab-panel ${i === activeIndex ? 'active' : ''}" data-panel="${i}">${t.content}</div>`).join('')}
    </div>`;
  },

  kanban(columns) {
    return `<div class="kanban">${columns.map(col =>
      `<div class="kanban-col"><h4>${col.title} (${col.cards.length})</h4>
        ${col.cards.map(c => `<div class="kanban-card" ${c.nav ? `data-nav="${c.nav}"` : ''}>
          <div class="name">${c.name}</div>
          <div class="meta">${c.meta || ''}</div>
          ${c.badge ? UI.badge(c.badge) : ''}
        </div>`).join('')}
      </div>`
    ).join('')}</div>`;
  },

  checklist(items) {
    return items.map(i => `<div class="checklist-item ${i.done ? 'done' : ''}">
      <input type="checkbox" ${i.done ? 'checked' : ''} ${i.disabled ? 'disabled' : ''}>
      <div><div class="item-label">${i.label}</div><div style="font-size:.75rem;color:var(--muted)">${i.owner || ''}</div></div>
    </div>`).join('');
  },

  timeline(items) {
    return `<div class="timeline">${items.map(i =>
      `<div class="timeline-item"><div class="time">${i.time}</div><div class="action">${i.action}</div><div style="font-size:.8rem;color:var(--muted)">${i.detail || ''}</div></div>`
    ).join('')}</div>`;
  },

  alert(type, msg) {
    return `<div class="alert alert-${type}">${msg}</div>`;
  },

  approveRejectButtons(entityType, entityId) {
    return `<button class="btn btn-success btn-sm" data-action="approve" data-type="${entityType}" data-id="${entityId}">Approve</button>
            <button class="btn btn-danger btn-sm" data-action="reject" data-type="${entityType}" data-id="${entityId}">Reject</button>`;
  }
};
