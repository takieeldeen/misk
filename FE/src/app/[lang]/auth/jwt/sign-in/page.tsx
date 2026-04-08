import { JwtSignInView } from 'src/auth/view/jwt';

// ----------------------------------------------------------------------

// export const metadata = { title: `Sign in | Jwt - ${CONFIG.appName}` };

export function generateMetadata({ params }: { params: { lang: string } }) {
  return params.lang === 'ar' ? { title: `تسجيل الدخول | مسك` } : { title: `Sign in | Misk` };
}

export default function Page() {
  return <JwtSignInView />;
}
