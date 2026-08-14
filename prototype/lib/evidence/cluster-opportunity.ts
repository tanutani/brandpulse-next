export interface ClusterableEvidence { id: string; topic: string }
export interface EvidenceCluster<T extends ClusterableEvidence> {
  id: string;
  topic: string;
  evidenceIds: string[];
  records: T[];
}

export function normalizeTopic(topic: string): string {
  return topic
    .normalize("NFKC")
    .trim()
    .toLocaleLowerCase("en")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim()
    .replace(/\s+/g, " ");
}

export function clusterOpportunity<T extends ClusterableEvidence>(records: readonly T[]): EvidenceCluster<T>[] {
  const grouped = new Map<string, T[]>();
  for (const record of records) {
    const topic = normalizeTopic(record.topic);
    grouped.set(topic, [...(grouped.get(topic) ?? []), record]);
  }
  return [...grouped.entries()]
    .sort(([a], [b]) => a.localeCompare(b, "en"))
    .map(([topic, items]) => ({
      id: `topic:${topic.replace(/\s+/g, "-") || "unclassified"}`,
      topic,
      evidenceIds: items.map(({ id }) => id).sort(),
      records: [...items].sort((a, b) => a.id.localeCompare(b.id, "en")),
    }));
}
