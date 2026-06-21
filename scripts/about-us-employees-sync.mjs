import fs from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

const enPath = path.join(repoRoot, 'jsonContent', 'about-us', 'en.json');
const svPath = path.join(repoRoot, 'jsonContent', 'about-us', 'sv.json');

function isRecord(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function getEmployees(doc) {
  if (!isRecord(doc?.allEmployeesSection)) return [];
  const employees = doc.allEmployeesSection.employees;
  return Array.isArray(employees) ? employees : [];
}

function sanitizeEmployees(employees) {
  return employees
    .filter((item) => isRecord(item))
    .map((item) => ({ ...item }));
}

function normalizeEmployeeId(value) {
  if (typeof value !== 'string') return '';
  return value.trim();
}

function createRandomEmployeeId(usedIds) {
  let id = '';
  do {
    id = `employee-${randomUUID().replace(/-/g, '').slice(0, 10)}`;
  } while (usedIds.has(id));
  return id;
}

function ensureEmployeeIds(employees) {
  const usedIds = new Set();
  let generatedIdsCount = 0;

  const normalizedEmployees = employees.map((employee) => {
    const nextEmployee = { ...employee };
    const existingId = normalizeEmployeeId(nextEmployee.id);

    if (!existingId || usedIds.has(existingId)) {
      nextEmployee.id = createRandomEmployeeId(usedIds);
      usedIds.add(nextEmployee.id);
      generatedIdsCount += 1;
      return nextEmployee;
    }

    nextEmployee.id = existingId;
    usedIds.add(existingId);
    return nextEmployee;
  });

  return { normalizedEmployees, generatedIdsCount };
}

function writeIfChanged(filePath, nextDoc) {
  const previous = fs.readFileSync(filePath, 'utf8');
  const next = `${JSON.stringify(nextDoc, null, 2)}\n`;
  const changed = previous !== next;

  if (changed) fs.writeFileSync(filePath, next, 'utf8');
  return changed;
}

function syncAboutUsEmployees() {
  const enDoc = JSON.parse(fs.readFileSync(enPath, 'utf8'));
  const svDoc = JSON.parse(fs.readFileSync(svPath, 'utf8'));

  const sourceEmployees = sanitizeEmployees(getEmployees(enDoc));
  const { normalizedEmployees, generatedIdsCount } = ensureEmployeeIds(sourceEmployees);
  const previousSvEmployees = getEmployees(svDoc);
  const previousEnEmployees = getEmployees(enDoc);

  if (!isRecord(enDoc.allEmployeesSection)) enDoc.allEmployeesSection = {};
  enDoc.allEmployeesSection = {
    ...enDoc.allEmployeesSection,
    employees: normalizedEmployees,
  };

  if (!isRecord(svDoc.allEmployeesSection)) svDoc.allEmployeesSection = {};
  svDoc.allEmployeesSection = {
    ...svDoc.allEmployeesSection,
    employees: normalizedEmployees,
  };

  const enChanged = writeIfChanged(enPath, enDoc);
  const svChanged = writeIfChanged(svPath, svDoc);

  return {
    sourceLocale: 'en',
    syncedEmployeesCount: normalizedEmployees.length,
    generatedIdsCount,
    results: [
      {
        locale: 'en',
        filePath: 'jsonContent/about-us/en.json',
        previousCount: previousEnEmployees.length,
        finalCount: normalizedEmployees.length,
        changed: enChanged,
      },
      {
        locale: 'sv',
        filePath: 'jsonContent/about-us/sv.json',
        previousCount: previousSvEmployees.length,
        finalCount: normalizedEmployees.length,
        changed: svChanged,
      },
    ],
  };
}

const summary = syncAboutUsEmployees();
console.log(JSON.stringify(summary, null, 2));
