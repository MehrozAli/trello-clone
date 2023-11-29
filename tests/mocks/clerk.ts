type Session = { userId: string | null; orgId: string | null };

const session: Session = { userId: null, orgId: null };

export const signInAs = (userId: string, orgId: string | null) => {
  session.userId = userId;
  session.orgId = orgId;
};

export const signOut = () => {
  session.userId = null;
  session.orgId = null;
};

export const clerkServerMock = {
  auth: async () => ({
    userId: session.userId,
    orgId: session.orgId,
    orgSlug: session.orgId ? `${session.orgId}-slug` : null,
  }),
  currentUser: async () =>
    session.userId
      ? {
          id: session.userId,
          firstName: "Test",
          lastName: "User",
          imageUrl: "/avatars/test.svg",
          primaryEmailAddress: { emailAddress: "test@example.com" },
          emailAddresses: [{ emailAddress: "test@example.com" }],
        }
      : null,
};
