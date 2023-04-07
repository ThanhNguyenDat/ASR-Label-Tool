let data = [
  {
    id: 'dashboards',
    icon: 'iconsminds-digital-drawing',
    label: 'Dashboard',
    to: '/app/dashboards',
  },
  {
    id: 'logs',
    icon: 'iconsminds-check',
    label: 'Logs',
    to: '/app/logs',
  },
  {
    id: 'admins',
    icon: 'simple-icon-people',
    label: 'Admins',
    to: '/app/admins',
    isRootRequired: true,
  },
  {
    id: 'partners',
    icon: 'iconsminds-handshake',
    label: 'Partners',
    to: '/app/partners',
    isRootRequired: true,
  },
  {
    id: 'configs',
    icon: 'simple-icon-info',
    label: 'Configs',
    to: '/app/configs',
    isRootRequired: true,
  },
  {
    id: 'fiza-ekyc',
    icon: 'simple-icon-info',
    label: 'Fiza eKyc',
    to: '/app/fiza-ekyc',
  },
  {
    id: 'bulk-test',
    icon: 'simple-icon-info',
    label: 'Test eKyc',
    to: '/app/bulk-test',
  },
  {
    id: 'photo-id',
    icon: 'simple-icon-info',
    label: 'Photo ID',
    to: '/app/photo_url',
  },
];

if (window.location.href.includes("backtest-ekyc.zalo.ai")) {
  data = data.filter(e => e.id != 'fiza-ekyc');
}

export default data;
