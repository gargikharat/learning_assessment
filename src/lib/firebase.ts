import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfigJson from '../../firebase-applet-config.json';

function clean(val: unknown): string {
  if (!val || typeof val !== 'string') return '';
  let str = val.trim();
  while (
    (str.startsWith('"') && str.endsWith('"')) ||
    (str.startsWith("'") && str.endsWith("'"))
  ) {
    str = str.slice(1, -1).trim();
  }
  return str;
}

const envApiKey = clean(import.meta.env.VITE_FIREBASE_API_KEY);
const envAuthDomain = clean(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN);
const envProjectId = clean(import.meta.env.VITE_FIREBASE_PROJECT_ID);
const envStorageBucket = clean(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET);
const envMessagingSenderId = clean(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID);
const envAppId = clean(import.meta.env.VITE_FIREBASE_APP_ID);
const envDatabaseId = clean(import.meta.env.VITE_FIREBASE_DATABASE_ID);

const firebaseConfig = {
  apiKey: envApiKey || clean(firebaseConfigJson.apiKey),
  authDomain: envAuthDomain || clean(firebaseConfigJson.authDomain),
  projectId: envProjectId || clean(firebaseConfigJson.projectId),
  storageBucket: envStorageBucket || clean(firebaseConfigJson.storageBucket),
  messagingSenderId: envMessagingSenderId || clean(firebaseConfigJson.messagingSenderId),
  appId: envAppId || clean(firebaseConfigJson.appId),
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Use provisioned Firestore Database ID if specified
// Note: IDs starting with 'G-' are Google Analytics Measurement IDs (e.g. G-36KSCCXEY1) rather than Firestore Database IDs.
const isAnalyticsId = (id: string) => /^G-[A-Z0-9]+$/i.test(id);

let databaseId = '';
if (envDatabaseId && !isAnalyticsId(envDatabaseId) && envDatabaseId !== '(default)') {
  databaseId = envDatabaseId;
} else if (
  firebaseConfig.projectId === clean(firebaseConfigJson.projectId) &&
  clean(firebaseConfigJson.firestoreDatabaseId) &&
  clean(firebaseConfigJson.firestoreDatabaseId) !== '(default)'
) {
  databaseId = clean(firebaseConfigJson.firestoreDatabaseId);
}

export const db = databaseId ? getFirestore(app, databaseId) : getFirestore(app);

// Verification check as required by Firebase skill
async function testFirestoreConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase connection: offline or configuration pending.');
    }
  }
}

testFirestoreConnection();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map((provider) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}
