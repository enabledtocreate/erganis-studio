import {
  AssignmentRecord,
  CoreApiClient,
  ProjectRecord,
  RoomRecord,
  SurfaceLoadResult,
} from '@erganis/studio-shared';
import { cookies } from 'next/headers';
import { config } from './config';

function serverClient() {
  const cookieStore = cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ');
  return new CoreApiClient(config.coreApiUrl, (input, init) =>
    fetch(input, {
      ...init,
      headers: {
        ...init?.headers,
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      },
      cache: 'no-store',
    }),
  );
}

export async function loadProjects(): Promise<ProjectRecord[]> {
  const client = serverClient();
  const surface = await client.loadSurface(config.defaultOrgSlug, 'project');
  return extractProjects(surface);
}

export async function loadProjectDetail(projectPublicId: string): Promise<{
  project: ProjectRecord | null;
  rooms: RoomRecord[];
  assignments: AssignmentRecord[];
}> {
  const client = serverClient();
  const surface = await client.loadSurface(config.defaultOrgSlug, 'project', {
    projectPublicId,
  });
  const step = surface.modules['erganis.projects']?.['project-list'];
  const data = step?.data;
  if (!data || typeof data !== 'object') {
    return { project: null, rooms: [], assignments: [] };
  }
  return {
    project: (data.project as ProjectRecord | undefined) ?? null,
    rooms: Array.isArray(data.rooms) ? (data.rooms as RoomRecord[]) : [],
    assignments: Array.isArray(data.assignments) ? (data.assignments as AssignmentRecord[]) : [],
  };
}

export function extractProjects(surface: SurfaceLoadResult): ProjectRecord[] {
  const step = surface.modules['erganis.projects']?.['project-list'];
  const projects = step?.data?.projects;
  if (!Array.isArray(projects)) {
    return [];
  }
  return projects as ProjectRecord[];
}
