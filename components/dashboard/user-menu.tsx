"use client"

import { useTransition } from "react"
import Image from "next/image"
import { LogOut, User } from "lucide-react"
import { signOutAction } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type UserMenuProps = {
  name?: string | null
  email?: string | null
  image?: string | null
}

export function UserMenu({ name, email, image }: UserMenuProps) {
  const [isPending, startTransition] = useTransition()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-9 gap-2 px-2">
          {image ? (
            <Image
              src={image}
              alt={name ?? "Foto de perfil"}
              width={28}
              height={28}
              className="rounded-full"
            />
          ) : (
            <span className="bg-muted flex size-7 items-center justify-center rounded-full">
              <User className="size-4" />
            </span>
          )}
          <span className="hidden max-w-40 truncate text-sm font-medium sm:inline">
            {name ?? "Utilizador"}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col gap-0.5">
          <span className="truncate">{name ?? "Utilizador"}</span>
          {email && (
            <span className="text-muted-foreground truncate text-xs font-normal">{email}</span>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          disabled={isPending}
          onSelect={() => startTransition(() => signOutAction())}
        >
          <LogOut />
          {isPending ? "A sair..." : "Sair"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
