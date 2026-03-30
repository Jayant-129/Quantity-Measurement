import { beforeEach, describe, expect, it } from "@jest/globals";
import { populateDropdown, toggleOperators, setActive } from "../js/ui.js";

describe("ui helpers", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("populateDropdown adds default option and provided units", () => {
    document.body.innerHTML = '<select id="unit"></select>';
    const select = document.querySelector("#unit");

    populateDropdown(select, [
      { label: "meter", symbol: "m" },
      { label: "centimeter", symbol: "cm" }
    ]);

    expect(select.options).toHaveLength(3);
    expect(select.options[0].textContent).toBe("-- Select Unit --");
    expect(select.options[1].value).toBe("m");
    expect(select.options[2].value).toBe("cm");
  });

  it("toggleOperators shows and hides operator wrapper", () => {
    document.body.innerHTML = '<div id="operator-wrapper" style="display:none"></div><div id="op-spacer" style="display:block"></div>';
    const wrapper = document.querySelector("#operator-wrapper");
    const spacer = document.querySelector("#op-spacer");

    toggleOperators(true);
    expect(wrapper.style.display).toBe("flex");
    expect(spacer.style.display).toBe("none");

    toggleOperators(false);
    expect(wrapper.style.display).toBe("none");
    expect(spacer.style.display).toBe("block");
  });

  it("setActive toggles active class across sibling elements", () => {
    document.body.innerHTML = `
      <div id="parent">
        <button class="action-btn active" id="a">A</button>
        <button class="action-btn" id="b">B</button>
      </div>
    `;

    const parent = document.querySelector("#parent");
    const clicked = document.querySelector("#b");

    setActive(parent, clicked, ".action-btn");

    expect(document.querySelector("#a").classList.contains("active")).toBe(false);
    expect(document.querySelector("#b").classList.contains("active")).toBe(true);
  });
});