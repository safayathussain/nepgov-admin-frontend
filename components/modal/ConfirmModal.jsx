"use client";
import React, { useEffect, useRef } from "react";
import useClickOutside from "@/utils/useClickOutside";
import { useState } from "react";
import Modal from "./Modal";

const ConfirmModal = ({ title, open, setOpen, nextFunc = () => {} }) => {
 
  return (
    <div>
      {open && (
        <Modal open={open} setOpen={setOpen} className={`!items-start mt-3`}>
          <div className="bg-white p-5 rounded-lg min-w-[300px]">
            <p className="text-lg">{title}</p>
            <div className="flex gap-2 mt-5">
              <button
                onClick={() => {
                  setOpen(false);
                }}
                className="py-1.5 w-full rounded-lg text-white bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  nextFunc();
                  setOpen(false);
                }}
                className="py-1.5 w-full rounded-lg text-white bg-green-500"
              >
                Confirm
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ConfirmModal;
