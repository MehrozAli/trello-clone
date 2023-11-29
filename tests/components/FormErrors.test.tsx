// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { FormErrors } from "@/components/Form/FormErrors";

describe("FormErrors", () => {
  it("renders every message for its field", () => {
    render(
      <FormErrors
        id="title"
        errors={{ title: ["Title is too short", "Title is required"], other: ["x"] }}
      />
    );

    expect(screen.getByText("Title is too short")).toBeInTheDocument();
    expect(screen.getByText("Title is required")).toBeInTheDocument();
    expect(screen.queryByText("x")).not.toBeInTheDocument();
  });

  it("renders nothing without errors", () => {
    const { container } = render(<FormErrors id="title" />);

    expect(container).toBeEmptyDOMElement();
  });
});
