import { useRouter } from 'next/dist/client/router';
import Link, { LinkProps } from 'next/link';
import { ReactElement, cloneElement } from 'react';

interface Props extends LinkProps {
  children: ReactElement;
  activeClassname: string;
}

export const ActiveLink = ({ children, activeClassname, ...rest }: Props) => {
  const { asPath } = useRouter();

  const className = asPath === rest.href ? activeClassname : '';

  return (
    <Link {...rest}>
      {cloneElement(children, {
        className,
      })}
    </Link>
  );
};
