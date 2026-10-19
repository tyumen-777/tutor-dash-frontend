'use client'

import {
	BookOpenCheck,
	BriefcaseBusiness,
	CalendarDays,
	ChevronRight,
	GraduationCap,
	Home,
	LibraryBig,
	type LucideIcon,
	PanelLeftClose,
	PanelLeftOpen,
	Settings,
	UsersRound,
	WalletCards
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger
} from '@/components/ui/collapsible'
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarInset,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
	SidebarProvider,
	SidebarRail,
	SidebarSeparator,
	SidebarTrigger,
	useSidebar
} from '@/components/ui/sidebar'

import { LogoutButton } from '@/features/auth/components/logout-button'

type NavigationLink = {
	title: string
	href: string
	icon: LucideIcon
}

type NavigationGroup = {
	title: string
	icon: LucideIcon
	children: {
		title: string
		href: string
	}[]
}

const navigation: (NavigationLink | NavigationGroup)[] = [
	{ title: 'Обзор', href: '/', icon: Home },
	{ title: 'Ученики', href: '/students', icon: UsersRound },
	{ title: 'Преподаватели', href: '/teachers', icon: BriefcaseBusiness },
	{ title: 'Занятия', href: '/lessons', icon: GraduationCap },
	{
		title: 'Финансы',
		icon: WalletCards,
		children: [
			{ title: 'Расходы', href: '/expenses' },
			{ title: 'Поступления', href: '/income' }
		]
	},
	{ title: 'Расписание', href: '/calendar', icon: CalendarDays },
	{ title: 'Материалы', href: '/materials', icon: LibraryBig },
	{ title: 'Настройки', href: '/settings', icon: Settings }
]

function isActiveRoute(pathname: string, href: string) {
	if (href === '/') {
		return pathname === '/'
	}

	return pathname === href || pathname.startsWith(`${href}/`)
}

function SidebarNavigationGroup({
	item,
	pathname,
	setOpenMobile
}: {
	item: NavigationGroup
	pathname: string
	setOpenMobile: (open: boolean) => void
}) {
	const Icon = item.icon
	const isActive = item.children.some(child =>
		isActiveRoute(pathname, child.href)
	)
	const [userOpen, setUserOpen] = useState(isActive)
	const open = isActive || userOpen

	return (
		<Collapsible
			open={open}
			onOpenChange={setUserOpen}
			className='group/collapsible'
			render={<SidebarMenuItem />}
		>
			<CollapsibleTrigger
				render={
					<SidebarMenuButton
						tooltip={item.title}
						isActive={isActive}
						size='lg'
					>
						<Icon aria-hidden='true' />
						<span className='group-data-[collapsible=icon]:hidden'>
							{item.title}
						</span>
						<ChevronRight
							className='ml-auto transition-transform group-data-[collapsible=icon]:hidden group-data-[open]/collapsible:rotate-90'
							aria-hidden='true'
						/>
					</SidebarMenuButton>
				}
			/>

			<CollapsibleContent>
				<SidebarMenuSub>
					{item.children.map(child => (
						<SidebarMenuSubItem key={child.href}>
							<SidebarMenuSubButton
								isActive={isActiveRoute(pathname, child.href)}
								render={
									<Link
										href={child.href}
										onClick={() => setOpenMobile(false)}
									>
										<span>{child.title}</span>
									</Link>
								}
							/>
						</SidebarMenuSubItem>
					))}
				</SidebarMenuSub>
			</CollapsibleContent>
		</Collapsible>
	)
}

function SidebarNavigation({ pathname }: { pathname: string }) {
	const { setOpenMobile } = useSidebar()

	return (
		<SidebarMenu className='gap-1'>
			{navigation.map(item => {
				const Icon = item.icon

				if ('children' in item) {
					return (
						<SidebarNavigationGroup
							key={item.title}
							item={item}
							pathname={pathname}
							setOpenMobile={setOpenMobile}
						/>
					)
				}

				const isActive = isActiveRoute(pathname, item.href)

				return (
					<SidebarMenuItem key={item.href}>
						<SidebarMenuButton
							tooltip={item.title}
							isActive={isActive}
							size='lg'
							render={
								<Link
									href={item.href}
									onClick={() => setOpenMobile(false)}
								>
									<Icon aria-hidden='true' />
									<span className='group-data-[collapsible=icon]:hidden'>
										{item.title}
									</span>
								</Link>
							}
						/>
					</SidebarMenuItem>
				)
			})}
		</SidebarMenu>
	)
}

function SidebarToggleButton() {
	const { state, toggleSidebar } = useSidebar()
	const isCollapsed = state === 'collapsed'
	const label = isCollapsed ? 'Развернуть панель' : 'Свернуть панель'
	const Icon = isCollapsed ? PanelLeftOpen : PanelLeftClose

	return (
		<SidebarMenuButton
			size='lg'
			tooltip={label}
			aria-label={label}
			aria-expanded={!isCollapsed}
			onClick={toggleSidebar}
		>
			<Icon aria-hidden='true' />
			<div className='min-w-0 group-data-[collapsible=icon]:hidden'>
				<p className='truncate text-sm leading-5 font-medium'>
					{label}
				</p>
				<p className='text-sidebar-foreground/70 truncate text-xs leading-4'>
					Нажмите Cmd/Ctrl + B
				</p>
			</div>
		</SidebarMenuButton>
	)
}

export function AppSidebar({ children }: { children: React.ReactNode }) {
	const pathname = usePathname()

	return (
		<SidebarProvider>
			<Sidebar collapsible='icon'>
				<SidebarHeader className='px-3 py-3 group-data-[collapsible=icon]:px-2'>
					<div className='flex h-10 items-center gap-3 rounded-md px-1 group-data-[collapsible=icon]:px-0'>
						<div className='bg-sidebar-primary text-sidebar-primary-foreground flex size-9 shrink-0 items-center justify-center rounded-md group-data-[collapsible=icon]:size-8 [&>svg]:size-5'>
							<BookOpenCheck aria-hidden='true' />
						</div>
						<div className='min-w-0 group-data-[collapsible=icon]:hidden'>
							<p className='truncate text-sm leading-5 font-semibold'>
								Tutor Dash
							</p>
							<p className='text-sidebar-foreground/70 truncate text-xs leading-4'>
								Кабинет преподавателя
							</p>
						</div>
					</div>
				</SidebarHeader>

				<SidebarSeparator />

				<SidebarContent className='px-1 py-2 group-data-[collapsible=icon]:px-0'>
					<SidebarGroup>
						<SidebarGroupLabel>Рабочая область</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarNavigation pathname={pathname} />
						</SidebarGroupContent>
					</SidebarGroup>
				</SidebarContent>

				<SidebarFooter className='px-3 py-3 group-data-[collapsible=icon]:px-2'>
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarToggleButton />
						</SidebarMenuItem>
						<SidebarMenuItem>
							<LogoutButton />
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarFooter>
				<SidebarRail />
			</Sidebar>

			<SidebarInset className='min-w-0'>
				<header className='bg-background/95 sticky top-0 z-20 flex h-14 items-center gap-3 border-b px-4 backdrop-blur md:hidden'>
					<SidebarTrigger />
					<div className='min-w-0'>
						<p className='truncate text-sm leading-5 font-semibold'>
							Tutor Dash
						</p>
						<p className='text-muted-foreground truncate text-xs leading-4'>
							Кабинет преподавателя
						</p>
					</div>
				</header>
				<div className='flex min-h-svh flex-1 flex-col'>{children}</div>
			</SidebarInset>
		</SidebarProvider>
	)
}
