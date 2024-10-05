import React, { useEffect, useState } from "react";
import { Switch } from "@nextui-org/react";
import { MoonIcon } from "./MoonIcon";
import { SunIcon } from "./SunIcon";
import { useTheme } from "next-themes";

export default function ThemeSwitcher() {
    const [mounted, setMounted] = useState(false)
    const { theme, setTheme } = useTheme();
    console.log(theme)

    const toggle = () => {

        if (theme === "light") {
            setTheme('dark');
        }
        if (theme === "dark") {
            setTheme('light');
        }
    }
    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null
    return (
        <Switch
            defaultSelected
            size="md"
            color="secondary"
            thumbIcon={({ isSelected, className }) =>
                isSelected ? (
                    <SunIcon className={className} />
                ) : (
                    <MoonIcon className={className} />
                )
            }
            onClick={toggle}
        >
        </Switch>
    );
}


