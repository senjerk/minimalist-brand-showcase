
import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-left"
      toastOptions={{
        classNames: {
          toast: "group w-full sm:w-[420px] text-base font-medium border-border p-6 mt-4 ml-4",
          title: "text-base font-semibold",
          description: "text-sm opacity-90",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          error: "group-[.toast]:bg-destructive group-[.toast]:text-destructive-foreground",
          success: "group-[.toast]:border-green-500",
          info: "group-[.toast]:border-blue-500",
          warning: "group-[.toast]:border-yellow-500",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
