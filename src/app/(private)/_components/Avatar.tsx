"use client";
import { Button } from "@/components/ui/button";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { logout } from "../_actions/logoutAction";

export default function Avatar({ children }: { children: React.ReactNode }) {
	return (
		<ContextMenu>
			<ContextMenuTrigger className="flex itemns-center">{children}</ContextMenuTrigger>
			<ContextMenuContent datatype="bottom">
				<ContextMenuItem>
					<Button className="w-full bg-destructive" onClick={async () => await logout()}>
						Logout
					</Button>
				</ContextMenuItem>
			</ContextMenuContent>
		</ContextMenu>
	);
}
