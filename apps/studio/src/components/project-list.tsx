'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProjectRecord } from '@erganis/studio-shared';
import Link from 'next/link';
import { Card, CardBody } from '@/components/ui/card';

interface ProjectListProps {
  projects: ProjectRecord[];
}

export function ProjectList({ projects }: ProjectListProps) {
  if (projects.length === 0) {
    return (
      <Card>
        <CardBody>
          <p className="text-sm text-ink-500">No projects yet — create one above.</p>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <Link key={project.publicId} href={`/projects/${project.publicId}`}>
          <Card className="h-full transition-colors hover:border-ink-300">
            <CardBody>
              <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-ink-400">
                {project.status.replace('_', ' ')}
              </p>
              <h2 className="mt-2 font-display text-xl text-ink-950">{project.name}</h2>
              <p className="mt-1 text-sm text-ink-600">{project.phase ?? 'No phase set'}</p>
            </CardBody>
          </Card>
        </Link>
      ))}
    </div>
  );
}
