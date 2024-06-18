import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
  {
    title: 'Biểu đồ thống kê',
    path: '/',
    icon: icon('ic_analytics'),
  },
  {
    title: 'Đơn vị trực thuộc',
    path: '/dvtt',
    icon: icon('ic_blog'),
  },
  {
    title: 'kiểm tra',
    path: '/check',
    icon: icon('ic_blog'),
  },
  {
    title: 'tài khoản',
    path: '/user',
    icon: icon('ic_user'),
  },
  {
    title: 'đăng nhập',
    path: '/login',
    icon: icon('ic_lock'),
  },
];

export default navConfig;
