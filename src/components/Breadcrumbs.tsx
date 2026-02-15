import type React from "react";
import { Link, useLocation } from "react-router-dom";

const Breadcrumbs = (): React.ReactElement => {
    const location = useLocation();
    const paths = location.pathname.split("/").filter(Boolean);

    return (
        <nav className="text-[16px] font-semibold text-blue-muted flex items-center gap-2 px-8 pt-4 pb-1">
            <Link to="/" className="hover:text-blue-primary">
                Dashboard
            </Link>

            {paths.map((path, index) => {
                const to = "/" + paths.slice(0, index + 1).join("/");
                const label = path.replace(/-/g, " ");

                return (
                    <span key={to} className="flex items-center gap-2">
                        <span className="opacity-50">›</span>
                        {index === paths.length - 1 ? (
                            <span className="text-blue-primary capitalize">
                                {label}
                            </span>
                        ) : (
                            <Link to={to} className="hover:text-blue-primary capitalize">
                                {label}
                            </Link>
                        )}
                    </span>
                );
            })}
        </nav>
    );
};

export default Breadcrumbs