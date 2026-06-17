import type { TableStyles } from 'react-data-table-component'

/** Dark theme — overrides RDT default light gray row hover */
export const tsaiDataTableTheme = {
  text: {
    primary: '#f9f9f9',
    secondary: '#adb1b8',
    disabled: '#6b7280',
  },
  background: {
    default: 'transparent',
  },
  context: {
    background: 'rgba(11, 23, 54, 0.9)',
    text: '#adb1b8',
  },
  divider: {
    default: 'rgba(255, 255, 255, 0.06)',
  },
  button: {
    default: 'rgba(255, 255, 255, 0.08)',
    hover: 'rgba(18, 215, 245, 0.12)',
    focus: 'rgba(18, 215, 245, 0.2)',
    disabled: 'rgba(255, 255, 255, 0.04)',
  },
  selected: {
    default: 'rgba(18, 215, 245, 0.1)',
    text: '#f9f9f9',
  },
  highlightOnHover: {
    default: 'rgba(18, 215, 245, 0.05)',
    text: '#f9f9f9',
  },
  sortFocus: {
    default: 'rgba(18, 215, 245, 0.2)',
  },
} as const

const cellPadding = {
  paddingTop: '16px',
  paddingBottom: '16px',
  paddingLeft: '16px',
  paddingRight: '16px',
}

export const tsaiDataTableStyles: TableStyles = {
  table: {
    style: {
      backgroundColor: 'transparent',
      color: '#f9f9f9',
    },
  },
  tableWrapper: {
    style: {
      display: 'block',
      overflow: 'visible',
      width: '100%',
      // padding: '8px 16px 12px',
    },
  },
  headRow: {
    style: {
      backgroundColor: 'rgba(11, 23, 54, 0.65)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      minHeight: '56px',
    },
  },
  headCells: {
    style: {
      color: '#adb1b8',
      fontSize: '10px',
      fontWeight: 600,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      ...cellPadding,
    },
  },
  rows: {
    style: {
      backgroundColor: 'transparent',
      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
      minHeight: '84px',
      width: '100%',
      cursor: 'default',
      transition: 'background-color 0.2s ease',
    },
    highlightOnHoverStyle: {
      backgroundColor: 'rgba(18, 215, 245, 0.05)',
      borderBottomColor: 'rgba(255, 255, 255, 0.08)',
      outline: 'none',
      boxShadow: 'none',
      width: '100%',
    },
  },
  cells: {
    style: {
      color: '#c7ccd2',
      fontSize: '14px',
      ...cellPadding,
      overflow: 'visible',
    },
  },
  responsiveWrapper: {
    style: {
      overflow: 'visible',
    },
  },
  pagination: {
    style: {
      backgroundColor: 'transparent',
      borderTop: 'none',
      color: '#c7ccd2',
      minHeight: '0',
    },
  },
  noData: {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '56px',
      color: '#adb1b8',
      backgroundColor: 'transparent',
    },
  },
}
